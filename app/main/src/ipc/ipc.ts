import { type ClientSideInterface, type ServerSideInterface } from '@maa/ipc'
import { type IpcMainInvokeEvent, ipcMain } from 'electron'

import { mainWindow } from '../window'

export function ipcMainHandle<Key extends keyof ServerSideInterface>(
  eventName: Key,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: Parameters<ServerSideInterface[Key]>
  ) => ReturnType<ServerSideInterface[Key]>
): void {
  console.log('main register: ', eventName)
  ipcMain.removeHandler(eventName)
  ipcMain.handle(eventName, (event, ...args) => {
    console.log('main handle: ', eventName, ...args)
    return listener(event, ...(args as Parameters<ServerSideInterface[Key]>))
  })
}

export function ipcMainRemove(eventName: keyof ServerSideInterface): void {
  console.log('main remove: ', eventName)
  ipcMain.removeHandler(eventName)
}

export function ipcMainSend<Key extends keyof ClientSideInterface>(
  eventName: Key,
  ...args: Parameters<ClientSideInterface[Key]>
): void {
  console.log('main send: ', eventName, ...args)
  mainWindow.webContents.send(eventName, ...args)
}

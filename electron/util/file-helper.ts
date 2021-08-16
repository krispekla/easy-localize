import * as fs from 'fs'
import { Settings } from '../handlers/settings-handler'
import { app } from '../main'
let APP_CONFIG_ROOT_PATH_CONFIG: string

function checkIfConfigFileExists() {
    if (!APP_CONFIG_ROOT_PATH_CONFIG) {
        const APP_CONFIG_ROOT_PATH = app.getPath('userData')
        APP_CONFIG_ROOT_PATH_CONFIG = APP_CONFIG_ROOT_PATH + 'config.json'
    }
}

export function writeAppSettings(event: Electron.IpcMainEvent, args: any[]) {
    checkIfConfigFileExists()

    const configData = JSON.stringify(args)
    fs.writeFileSync(APP_CONFIG_ROOT_PATH_CONFIG, configData, 'utf-8')
}

export function readAppSettings(): Settings {
    checkIfConfigFileExists()

    const rawData = fs.readFileSync(APP_CONFIG_ROOT_PATH_CONFIG)
    let loadedData = JSON.parse(rawData.toString());

    return loadedData
}

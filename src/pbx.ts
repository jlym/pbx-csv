import * as fs from 'fs';
import * as path from 'path';

export const updatePBXFile = (pbxInputFile: string, pbxOutputFile: string, mediaFileDirectory: string): void => {

};

const getMediaFiles = (mediaFileDirectory: string): string[] => {
    return fs.readdirSync(mediaFileDirectory);
};


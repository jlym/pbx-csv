import * as fs from 'fs';
import * as transform from 'stream-transform';
import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

export const updatePBXFile = (pbxInputFile: string, pbxOutputFile: string, mediaFileDirectory: string): void => {

    const readStream = fs.createReadStream(pbxInputFile);
    const out = fs.createWriteStream(pbxOutputFile);

    let firstRow = true;
    let uniqueIDIndex = -1;

    const suffixToFile = getMediaFiles(mediaFileDirectory);
    const tranformer = transform((record: any) => {
        const cells = record as string[];
        if (!cells) {
            return record;
        }
        
        if (firstRow) {
            firstRow = false;
            uniqueIDIndex = record.indexOf('uniqueid');
            cells.push('link');
            return cells;
        }

        if (uniqueIDIndex === -1) {
            return cells;
        }

        const uniqueID = cells[uniqueIDIndex];
        const uniqueIDTokens = uniqueID.split('.');
        const uniqueIDSuffix = uniqueIDTokens[uniqueIDTokens.length - 1];

        const file = suffixToFile.get(uniqueIDSuffix) || '';
        cells.push(file);
        
        return cells;
    });

    
    const parser = parse({delimiter: ',',});
    readStream.pipe(parser).pipe(tranformer).pipe(stringify()).pipe(out);
};

const getMediaFiles = (mediaFileDirectory: string): Map<string, string> => {
    const files = fs.readdirSync(mediaFileDirectory);

    const suffixToFile = new Map<string, string>();
    
    for (let file of files) {
        file = file.toLowerCase();
        if (!file.endsWith('.wav')) {
            continue;
        }

        const tokens = file.split('.');
        if (tokens.length < 3) {
            continue;
        }

        const suffix = tokens[tokens.length - 2];
        suffixToFile.set(suffix, mediaFileDirectory + '/' + file);
    }

    return suffixToFile;
};

import { updatePBXFile } from './pbx';

describe('updatePBXFile', () => {
    it('works', () => {
        updatePBXFile('/home/jeffrey/go/src/github.com/jlym/pbx-csv-3/test_data/Master (4).csv', '/home/jeffrey/go/src/github.com/jlym/pbx-csv-3/test_data/out.csv', '/home/jeffrey/go/src/github.com/jlym/pbx-csv-3/test_data/PBX_Queue_000B82C04652');
    });
})
import * as React from 'react';
import { remote, OpenDialogOptions } from 'electron';
import { Button, FormControl } from 'react-bootstrap';
import * as fs from 'fs';
import * as path from 'path';
import * as transform from 'stream-transform';
import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

interface IState {
  path: string;
  results: string;
}

interface IProps{}

export class App extends React.Component<IProps, IState> {
  public constructor(props: IProps){
    super(props);
    this.state = {
      path: '',
      results: ''
    };
  }
  public render() {
    return (
      <div style={
        {
          padding: 20,
        }
      }>
        <h1>PBX File Processor</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gridGap: "10px"
        }}>        
          <FormControl
            type="text"
            placeholder="CSV File Path"
            value={this.state.path}
            readOnly
            />
          <Button onClick={this.openDialog}>Open</Button>
          <Button 
            onClick={this.start}
            active
            style={{
              gridColumn: "1 / -1",
            }}>
            Start
          </Button>

          <p
          style={{
            gridColumn: "1 / -1",
          }}>
            {this.state.results}
          </p>
        </div>
        

        


      </div>
    );
  }

  private openDialog = () => {
    const dialog = remote.dialog;
    const options: OpenDialogOptions = {};
    dialog.showOpenDialog(remote.getCurrentWindow(), options, (filePaths: string[], _: string[]) => {
      if (!filePaths || filePaths.length == 0) {
        return;
      }

      this.setState({
        path: filePaths[0],    
      });
    });
  }

  private start = () => {


    const dir = path.dirname(this.state.path);
    if (!dir) {
      return
    }

    const files = fs.readdirSync(dir);

    let recordingsDir: string = '';
    for (const file of files) {
      if (file.startsWith('PBX_Queue')) {
        recordingsDir = file;
        break;
      }
    }

    if (!recordingsDir) {
      return;
    }

    const mediaFiles = fs.readdirSync(path.join(dir, recordingsDir));

    const results = mediaFiles.reduce((accumulator, current) => accumulator + ' ' + current);

    const readStream = fs.createReadStream(this.state.path);
    const out = fs.createWriteStream(dir + '/temp.txt');
    const tranformer = transform((record: any) => {
      console.log(record);
      return record;
    });

    const parser = parse({delimiter: ',',});

    //readStream.pipe(out);
    readStream.pipe(parser).pipe(tranformer).pipe(stringify()).pipe(out);
    
    this.setState({
      results,
    });
  }

}

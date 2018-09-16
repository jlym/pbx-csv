import * as React from 'react';
import { remote, OpenDialogOptions } from 'electron';
import { Button, FormControl } from 'react-bootstrap';
import * as fs from 'fs';
import * as path from 'path';
import * as transform from 'stream-transform';
import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

interface IState {
  inputPath: string;
  outputPath: string;
  pbxQueuePath: string;
  results: string;
}

interface IProps{}

export class App extends React.Component<IProps, IState> {
  public constructor(props: IProps){
    super(props);
    this.state = {
      inputPath: '',
      outputPath: '',
      pbxQueuePath: '',
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
            placeholder="Input CSV File Path"
            value={this.state.inputPath}
            readOnly
            />
          <Button onClick={this.openDialog}>Open</Button>

          <FormControl
            type="text"
            placeholder="Output CSV File Path"
            value={this.state.outputPath}
            readOnly
            />
          <Button onClick={this.openDialog}>Open</Button>

          <FormControl
            type="text"
            placeholder="PBX Queue directory"
            value={this.state.pbxQueuePath}
            readOnly
            />
          <Button onClick={this.openDialog}>Open</Button>

          <Button 
            onClick={this.start}
            bsStyle="primary"
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
    const options: OpenDialogOptions = {
      properties: ['openFile'],
    };

    dialog.showOpenDialog(remote.getCurrentWindow(), options, (filePaths: string[], _: string[]) => {
      if (!filePaths || filePaths.length === 0) {
        return;
      }      
      const filePath = filePaths[0];

      this.setState((state, props) => {
        
        let pbxQueuePath = getQueueDirectory(filePath) || undefined;
        const outputPath = getOutputFile(filePath);

        return {
          inputPath: filePath,
          outputPath,
          pbxQueuePath,
        };
      });
    });
  }

  private start = () => {

  }

}

const getQueueDirectory = (inputCSVFile: string): string => {
  const dir = path.dirname(inputCSVFile);
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.toLowerCase().startsWith('pbx_queue')) {
      continue;
    }

    return path.join(dir, file);
  }

  return '';
}

const getOutputFile = (inputCSVFile: string): string => {
  const dir = path.dirname(inputCSVFile);
  const fileName = path.basename(inputCSVFile, '.csv');

  const newFileName = fileName + '_updated' + '.csv';
  return path.join(dir, newFileName);
}


import * as React from 'react';
import { remote, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { Button, FormControl } from 'react-bootstrap';
import * as fs from 'fs';
import * as path from 'path';
import * as transform from 'stream-transform';
import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';
import { updatePBXFile } from './pbx';

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
            onChange={this.handleInputTextFieldChange}
            />
          <Button onClick={this.openInputFileDialog}>Open</Button>

          <FormControl
            type="text"
            placeholder="Output CSV File Path"
            value={this.state.outputPath}
            onChange={this.handleOutputTextFieldChange}
            />
          <Button onClick={this.openOutputFileDialog}>Open</Button>

          <FormControl
            type="text"
            placeholder="PBX Queue directory"
            value={this.state.pbxQueuePath}
            onChange={this.handleQueueTextFieldChange}
            />
          <Button onClick={this.openQueueFolderDialog}>Open</Button>

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

  private handleInputTextFieldChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      inputPath: e.currentTarget.value,
    });
  }

  private handleOutputTextFieldChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      outputPath: e.currentTarget.value,
    });
  }

  private handleQueueTextFieldChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      pbxQueuePath: e.currentTarget.value,
    });
  }

  private openInputFileDialog = () => {
    const dialog = remote.dialog;
    const options: OpenDialogOptions = {
      properties: ['openFile'],
    };

    dialog.showOpenDialog(remote.getCurrentWindow(), options, (filePaths: string[], _: string[]) => {
      if (!filePaths || filePaths.length === 0) {
        return;
      }      
      const filePath = filePaths[0];

      this.setState((state) => {
        
        let pbxQueuePath = undefined;
        if (!state.pbxQueuePath) {
          pbxQueuePath = getQueueDirectory(filePath) || undefined;  
        }

        let outputPath = undefined;
        if (!state.outputPath) {
          outputPath = getOutputFile(filePath) || undefined;
        }

        return {
          inputPath: filePath,
          outputPath,
          pbxQueuePath,
        };
      });
    });
  }

  private openOutputFileDialog = () => {
    const dialog = remote.dialog;
    const options: SaveDialogOptions = {};

    dialog.showSaveDialog(remote.getCurrentWindow(), options, (filePath: string, _: string) => {
      if (!filePath) {
        return;
      }      

      this.setState({
        outputPath: filePath,
      });      
    });
  }

  private openQueueFolderDialog = () => {
    const dialog = remote.dialog;
    const options: OpenDialogOptions = {
      properties: ['openDirectory'],
    };

    dialog.showOpenDialog(remote.getCurrentWindow(), options, (filePaths: string[], _: string[]) => {
      if (!filePaths || filePaths.length === 0) {
        return;
      }      
      const filePath = filePaths[0];

      this.setState({
        pbxQueuePath: filePath,
      });  
    });
  }

  private start = () => {
    updatePBXFile(this.state.inputPath, this.state.outputPath, this.state.pbxQueuePath);
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


import * as React from 'react';
import { remote, OpenDialogOptions } from 'electron';
import { Button, FormControl } from 'react-bootstrap';


interface IState {
  path: string;
  results: string;
}

export class App extends React.Component<undefined, IState> {
  public constructor(){
    super();
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
            />
          <Button onClick={this.openDialog}>Open</Button>
          <Button 
            onClick={this.start}
            style={{
              gridColumn: "1 / -1",
            }}>
            Start
          </Button>
        </div>
        
        <p>
          {this.state.results}
        </p>
        


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
        path: filePaths[0]
      });
    });
  }

  private start = () => {
    this.setState({
      results: "ran"
    });
  }

}

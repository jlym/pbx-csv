import * as React from 'react';
import { remote, OpenDialogOptions } from 'electron';

const openDialog = () => {
  const dialog = remote.dialog;
  const options: OpenDialogOptions = {};
  dialog.showOpenDialog(remote.getCurrentWindow(), options);

}
export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <h2>Welcome to React with Typescript!d</h2>

        <button onClick={openDialog}>Sup</button>
      </div>
    );
  }
}

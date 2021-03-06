/* tslint:disable max-line-length */
/* tslint:disable no-empty */

import fetchToTar from '../src';
import React, { Component } from 'react';

interface IState {
  value?: number;
  max?: number;
  error: any;
}

const ENTRIES = [
  { name: 'BigBuckBunny.mp4', src: 'https://raw.githubusercontent.com/mnaseersj/BigBuckBunny/master/BigBuckBunny_640x360.mp4' },
  { name: 'dracula.png', src: 'https://raw.githubusercontent.com/tatyshev/vscode-antimaterial/master/images/dracula.png' },
  { name: 'material.png', src: 'https://raw.githubusercontent.com/tatyshev/vscode-antimaterial/master/images/material.png' },
  { name: 'db.json', src: 'https://raw.githubusercontent.com/jshttp/mime-db/master/db.json' },
];

const noop = () => {};

export default class App extends Component<{}, IState> {
  state = {
    value: 0,
    max: 0,
    error: null,
  };

  cancel: null | (() => void) = noop;

  perform = () => {
    const { promise, cancel } = fetchToTar({
      unpackSingle: true,
      entries: ENTRIES,
      onProgress: (value, max) => {
        this.setState({ value, max });
      },
    });

    this.cancel = cancel;

    promise.then(({ blob, unpackedFileName }) => {
      const link = document.createElement('a');
      link.download = unpackedFileName ? unpackedFileName : `${Date.now()}.tar`;
      link.href = URL.createObjectURL(blob);

      document.body.append(link);
      link.click();

      setTimeout(() => document.body.removeChild(link));
    });

    promise.catch((err) => {
      this.setState({ error: err });
    });
  }

  render() {
    const { value, max, error } = this.state;

    return (
      <div className="b-sandbox">
        <progress max={max} value={value}/> ({value}/{max})
        <br/>
        <button className="b-sandbox__button" onClick={this.perform}>
          Perform
        </button>

        <button onClick={this.cancel}>
          Cancel
        </button>

        <br/>
        <br/>
        <br/>

        { String(error) }
      </div>
    );
  }
}

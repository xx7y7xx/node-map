import React from 'react';
import { Collapse } from 'antd';
import { Node, Socket, Control } from 'rete-react-render-plugin';
import { CONTROL_KEY_LAYER_ID } from './LayerComponent';

const { Panel } = Collapse;

const ACTIVE_KEY = '__nm_active_key__';

/**
 * The UI component to manage the properties of the mapbox layer.
 */
class LayerNode extends Node {
  onChange = (key: string | string[]) => {
    this.props.node.data[ACTIVE_KEY] = key;

    // to save node data
    this.props.editor.trigger('process');
  };

  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    let defaultActiveKey = ['1'];
    if (node.data[ACTIVE_KEY]) {
      defaultActiveKey = node.data[ACTIVE_KEY] as string[];
    }

    return (
      <div className={`node ${selected}`}>
        <div className="title">
          {'<<'} {node.name} {'>>'}
        </div>
        {/* Outputs */}
        {outputs.map((output) => (
          <div className="output" key={output.key}>
            <div className="output-title">{output.name}</div>
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}

        {/* Controls(layerId,filter) */}
        {controls
          .filter(
            (control) =>
              [CONTROL_KEY_LAYER_ID, 'filter'].indexOf(control.key) >= 0,
          )
          .map((control) => (
            <Control
              className="control"
              key={control.key}
              control={control}
              innerRef={bindControl}
            />
          ))}

        <Collapse
          size="small"
          defaultActiveKey={defaultActiveKey}
          onChange={this.onChange}>
          <Panel header="Layer Properties" key="1">
            {/* Controls(properties) */}
            {controls
              .filter(
                (control) =>
                  [CONTROL_KEY_LAYER_ID, 'filter'].indexOf(control.key) === -1,
              )
              .map((control) => (
                <Control
                  className="control"
                  key={control.key}
                  control={control}
                  innerRef={bindControl}
                />
              ))}
          </Panel>
        </Collapse>

        {/* Inputs */}
        {inputs.map((input) => (
          <div className="input" key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default LayerNode;

import React from 'react';

export default function TransformEvalFaq() {
  return (
    <div>
      <h1>Input Example</h1>
      <p>
        Input is any JSON object
        <code>[[103,1],[103,1]]</code>
        {' '}
        or
        {' '}
        <code>{ '{foo:\'bar\'}'}</code>
      </p>
      <h1>How to write transform</h1>
      <p>
        Only write the function body in the text box, think about the function is
        {' '}
        <code>{ 'function (input) { return input; }'}</code>
        <br />
        Use
        {' '}
        <code>input</code>
        {' '}
        as the input data, use
        {' '}
        <code>return</code>
        {' '}
        to output the transformed data
      </p>
    </div>
  );
}

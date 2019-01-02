import * as React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

interface props{
  WrappedComponent: any;
  selectorMapping: any;
}


@(connect((state : any, props : any) => {
  const res : any = {};
  for(let propName in props.selectorMapping) {
    res[propName] = props.selectorMapping[propName](state, props);
  }
  return res;
}) as any)
export default class SelectorResults extends PureComponent<props> {
  render() {
    const {
      WrappedComponent,
      selectorMapping,
      ...rest
    } = this.props;

    return (
      <WrappedComponent
        {...rest}
      />
    )
  }
}
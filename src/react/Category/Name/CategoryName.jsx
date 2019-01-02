import React, { PureComponent } from 'react'
import * as categoryRequests from 'src/requests/categoryRequests';
import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';

@fetchRequests((props) => ({
    category: categoryRequests.category(props.categoryId),
}), {
    renderLoader: () => null
})
export default class CategoryName extends PureComponent {
  render() {
    const { category, style } = this.props
    return <span style={style} >{category.name}</span>;
  }
}
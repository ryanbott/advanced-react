import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    console.log('uploading file..');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch('https://api.cloudinary.com/v1_1/ryan-bott/image/upload', {
      method: 'POST',
      body: data
    });
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
      {(createItem, { loading, error}) => (

      <Form
        onSubmit={async e => {
          //stop the for from submitting
          e.preventDefault();
          //call the mutation
          const res = await createItem();
          //change them to single item page
          console.log(res);
          Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id },
          });
        }}
      >
        <Error error={error} />
        <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input type="file" name="file" placeholder="Upload an Image" id="file" required  onChange={this.uploadFile} />

          {this.state.image && <img width="300" src={this.state.image} alt="Upload Preview" />}
        </label>

        <label htmlFor="title">
            Title
            <input type="title" name="title" placeholder="Title" id="title" required value={this.state.title} onChange={this.handleChange} />
          </label>

          <label htmlFor="price">
            Price
            <input type="number" name="price" placeholder="Price" id="price" required value={this.state.price} onChange={this.handleChange} />
          </label>

          <label htmlFor="description">
            Description
            <textarea name="description" placeholder="Enter a Description" id="description" required value={this.state.description} onChange={this.handleChange} />
          </label>

          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    )}
    </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };

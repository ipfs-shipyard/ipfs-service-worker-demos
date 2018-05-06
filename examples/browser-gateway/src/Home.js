import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.article``;

const Intro = styled.h1``;

const Examples = styled.div``;
const Example = styled.a``;

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Intro>
          try add <pre>/ipfs/somehashblabla</pre> to the URL
        </Intro>
        <Examples>
          <Example href="/ipfs/QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV">
            ipfs/QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV
          </Example>
        </Examples>
      </Container>
    );
  }
}

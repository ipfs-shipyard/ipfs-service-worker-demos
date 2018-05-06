import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Flex from 'styled-flex-component';

const Container = styled(Flex)`
  overflow: scroll;
`;

class Gateway extends Component {

  render() {
    return (
      <Container center column>
        {this.props.match.params.hash}
      </Container>
    );
  }
}

export default withRouter(Gateway);

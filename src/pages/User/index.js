import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default function User({ route, navigation }) {
  navigation.setOptions({ title: `${route.params.user.name}` });
  const [stars, setStars] = useState([]);
  const [user] = useState(route.params.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInfoFromRepo() {
      setLoading(true);
      const response = await api.get(`/users/${user.login}/starred`);
      setStars(response.data);
      setLoading(false);
    }
    getInfoFromRepo();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <Container>
          <ActivityIndicator color="#7159c1" size="large" />
        </Container>
      ) : (
        <Stars
          data={stars}
          keyExtractor={(star) => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string,
        login: PropTypes.string,
      }),
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }).isRequired,
};

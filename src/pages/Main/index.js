import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

export default function Main({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  useEffect(() => {
    async function getUsersFromMemory() {
      const usersOnMemory = await AsyncStorage.getItem('users');
      console.tron.log(navigation);
      if (usersOnMemory) {
        setUsers(JSON.parse(usersOnMemory));
      }
    }
    getUsersFromMemory();
  }, []);
  useEffect(() => {
    async function saveUsersMemory() {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
    saveUsersMemory();
  }, [users]);

  async function handleAddUser() {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);

    Keyboard.dismiss();
  }

  function handleNavigate(user) {
    navigation.navigate('User', { user });
  }
  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={(text) => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>
      <List
        data={users}
        keyExtractor={(user) => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>
            <ProfileButton
              onPress={() => {
                handleNavigate(item);
              }}
            >
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

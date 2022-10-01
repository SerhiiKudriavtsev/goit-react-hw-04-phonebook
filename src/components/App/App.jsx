import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import ContactFilter from '../ContactFilter/ContactFilter';
import { Div, Title, Text } from './App.styled';

class App extends Component {
  state = {
    contacts: [],
    filterText: '',
  }

  componentDidMount() { 
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) { 
      this.setState({contacts: parsedContacts});
    }
  }

  componentDidUpdate(prevProps, prevState) { 
    if (this.state.contacts.length !== prevState.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  formSubmitHandler = ({name, number}) => { 
    const { contacts } = this.state;
    const id = nanoid();
    const contactItem = {
      id,
      name,
      number,
    }

    contacts.some(contact => contact.name.toLowerCase() === contactItem.name.toLowerCase())
      ? alert(`${name} is already in contacts`)
      : this.setState(({ contacts }) => ({
      contacts: [...contacts, contactItem],
    }))
  };

  deleteContact = (e) => {
    const contactId = e.currentTarget.id;
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  filteredContactList = () => {
    const { filterText, contacts } = this.state;
    const normilizedValue = filterText.toLowerCase().trim();
      return contacts
        .filter(contact =>
          contact.name.toLowerCase().includes(normilizedValue))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

  changeFilter = (e) => { 
    this.setState({ filterText: e.currentTarget.value });
  }

  render() { 
    const { contacts, filterText } = this.state;
    const filteredContacts = this.filteredContactList();
    return (
      <Div>
        <Title>Phonebook</Title>
        <ContactForm onSubmitForm={this.formSubmitHandler} />
        
        <Title>Contacts</Title>
        <ContactFilter
          value={filterText}
          onChange={this.changeFilter}
        />
        {contacts[0] && !filteredContacts[0] &&
        (<Text>Contact not found</Text>)}
        
        {contacts[0] ? (
          <ContactList
          contacts={filteredContacts}
          onDeleleButton={this.deleteContact}
        />
        ) : (<Text>Contact list is empty</Text>)  
        }
      </Div>
  );
  }  
};

export default App;

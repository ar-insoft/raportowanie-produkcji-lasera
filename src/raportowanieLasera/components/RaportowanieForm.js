import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, List, Header, Label, Icon, Segment, Item } from 'semantic-ui-react'
import logo from '../../bar-code.png';
import './RaportowanieForm.css'
import RaportujLaser from '../modules/RaportujLaser'
import DetaleForm from './DetaleForm'

class RaportowanieForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            raportujLaser: new RaportujLaser(),
        }

        this.textInput_liczba_powtorzen = React.createRef()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        console.log('RaportowanieForm.handleChange ('+name+', '+value+')')
        this.setState({ raportujLaser: this.state.raportujLaser.setter({ [name]: value }) });
    }

    handleKeyOnScan = (event) => {
        var char = event.which || event.keyCode;
        //console.log('handleKeyOnScan '+ char)
        if (char === 13) this.handleScan()
    }

    handleScan = () => {
        this.state.raportujLaser.wyslijNaSerwer({}, raportujLaser => this.setState({ raportujLaser: raportujLaser }))
    }

    handleRozpocznijPrace = () => {
        //this.state.raportujLaser.setter({ rozpocznij_prace: 1 })
        this.state.raportujLaser.wyslijNaSerwer({ rozpocznij_prace: 1 }, raportujLaser => this.setState({ raportujLaser: raportujLaser }))
    }

    handlePrzerwijPrace = (idPraceLaser) => {
        this.state.raportujLaser.wyslijNaSerwer({ przerwij_prace: idPraceLaser }, raportujLaser => this.setState({ raportujLaser: raportujLaser }))
    }

    handleZakonczPrace = (idPraceLaser) => {
        this.state.raportujLaser.wyslijNaSerwer({ zakoncz_prace: idPraceLaser }, raportujLaser => this.setState({ raportujLaser: raportujLaser }))
    }

    handleRaport = () => {

    }

    setScan = (value) => {
        this.setState({ raportujLaser: this.state.raportujLaser.setter({ scanInput: value }) });
        //this.textInput_liczba_powtorzen.current.focus()
    }

    render() {
        const { raportujLaser } = this.state
        const { scanInput, liczba_powtorzen, employee, } = raportujLaser
        const pracownikOdczytany = raportujLaser.isPracownikOdczytany()
        const programOdczytany = raportujLaser.isProgramOdczytany()
        console.log('programOdczytany ' + programOdczytany)
        return (
            <Container textAlign='center'>
                <Form>
                    <Header as='h2'>Raportowanie produkcji lasera</Header>
                    <Segment.Group>                        
                        <Segment compact>
                            <Item.Group className='scan'>
                            <Item>
                                    <Item.Image size='tiny' src={logo} />

                                <Item.Content>
                                        <Item.Header>Zeskanuj kod:</Item.Header>
                                    {/* <Item.Meta>
                                        <span className='price'>$1200</span>
                                        <span className='stay'>1 Month</span>
                                    </Item.Meta> */}
                                        <Item.Description>
                                            <Input id='form-input-scanInput' name="scanInput" value={scanInput} type='text' autoFocus
                                                onChange={this.handleChange}
                                                onKeyDown={this.handleKeyOnScan}
                                            />
                                            <Button icon onClick={(evt) => this.handleScan()} type='button'>
                                                <Icon name='search' />
                                            </Button>
                                        </Item.Description>
                                </Item.Content>
                                </Item>
                                </Item.Group>
                        </Segment>
                        <Segment>
                            <Button icon onClick={(evt) => this.setScan(90065202)} type='button'>
                                <Icon name='external' />
                                Tomasz Tarka
                            </Button>
                            <Button icon onClick={(evt) => this.setScan('171121_2_304L_1')} type='button'>
                                <Icon name='external' />
                                171121_2_304L_1
                            </Button>
                            <Button icon onClick={(evt) => this.setScan('180517_2_304L_4')} type='button'>
                                <Icon name='external' />
                                180517_2_304L_4
                            </Button>
                        </Segment>
                        <Segment>
                        <Table celled striped>
                            {/* <Table.Header>
            <Table.Row>
            </Table.Row>
        </Table.Header> */}
                            <Table.Body>
                                <Table.Row key='pracownik'>
                                    <Table.Cell width={1}>
                                        Pracownik
                                    </Table.Cell>
                                        <Table.Cell width={3} className={pracownikOdczytany ? '' : 'niepoprawne_dane'}>
                                            {pracownikOdczytany ? raportujLaser.getEmployeeFulname() : 'Brak'}
                                    </Table.Cell>
                                    </Table.Row>
                                <Table.Row key='program'>
                                        <Table.Cell width={1}>
                                        Program
                                    </Table.Cell>
                                        <Table.Cell width={3} className={programOdczytany ? '' : 'niepoprawne_dane'}>
                                            {programOdczytany ?
                                                <Program raportujLaser={raportujLaser} handleRozpocznijPrace={this.handleRozpocznijPrace} />
                                            :
                                                'brak informacji o programie'}
                                    </Table.Cell>
                                </Table.Row>
                                    <Table.Row key='detaleProgramu'>
                                        <Table.Cell width={1}>
                                            Detale programu
                                    </Table.Cell>
                                        <Table.Cell width={3} className={programOdczytany ? '' : 'niepoprawne_dane'}>
                                            {programOdczytany ?
                                                <DetaleForm raportujLaser={raportujLaser} handleRozpocznijPrace={this.handleRozpocznijPrace} />
                                                :
                                                'brak'}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='liczba_powtorzen' disabled>
                                        <Table.Cell width={1}>
                                        Liczba powtórzeń
                                    </Table.Cell>
                                        <Table.Cell width={3} className={programOdczytany ? '' : 'niepoprawne_dane'}>
                                            <Input id='form-input-liczba_powtorzen' ref={this.textInput_liczba_powtorzen}
                                            name="liczba_powtorzen" value={liczba_powtorzen} onChange={this.handleChange}
                                            />
                                            <Button type='button' icon onClick={(evt) => this.handleRaport()}
                                                disabled={!pracownikOdczytany || !programOdczytany}
                                            >
                                                <Icon name='send' />
                                                Raportuj produkcję
                            </Button>
                                    </Table.Cell>
                                </Table.Row>
                                    <Table.Row key='prace'>
                                        <Table.Cell width={1}>
                                            Trwające prace
                                    </Table.Cell>
                                        <Table.Cell width={3} className={programOdczytany ? '' : 'niepoprawne_dane'}>
                                            {pracownikOdczytany
                                                ?
                                                <TrwajacePrace raportujLaser={raportujLaser}
                                                    handlePrzerwijPrace={this.handlePrzerwijPrace}
                                                    handleZakonczPrace={this.handleZakonczPrace} />
                                                : ''}
                                    </Table.Cell>
                                    </Table.Row>
                            </Table.Body>
                        </Table>
                        </Segment>
                    </Segment.Group>
                </Form>
            </Container>
        )
    }
}

class Program extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { raportujLaser, handleRozpocznijPrace } = this.props
        const { kartaProgramu, employee, } = raportujLaser
        const pracownikOdczytany = raportujLaser.isPracownikOdczytany()
        const programOdczytany = raportujLaser.isProgramOdczytany()
        return (
            <div>
            <Segment.Group horizontal basic>
                <Segment>
                    <List>
                        <List.Item>
                            <List.Icon name='laptop' />
                            <List.Content>Zlecenie: {kartaProgramu.nazwaZlecenia}</List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='industry' />
                            <List.Content>Maszyna: {kartaProgramu.maszyna}</List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Button type='button' icon onClick={(evt) => handleRozpocznijPrace()}
                        disabled={!pracownikOdczytany || !programOdczytany}
                    >
                        <Icon name='send' />
                        Rozpocznij pracę
                            </Button>

                </Segment>
            </Segment.Group>
        </div >
    )
    }
}

const TrwajacePrace = (props) => {
    const { raportujLaser, handlePrzerwijPrace, handleZakonczPrace } = props
    const { pracePracownika, employee, } = raportujLaser
    return (
    <Table celled striped>
        <Table.Header>
            <Table.Row>
                <Table.Cell>
                    Program
                </Table.Cell>
                <Table.Cell>
                    Rozpoczęcie
                </Table.Cell>
                <Table.Cell>
                    Akcje
                </Table.Cell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {pracePracownika.map(praca => 
                <Table.Row key={praca.id}>
                    <Table.Cell>
                        {praca.id_karta_programu}
                    </Table.Cell>
                    <Table.Cell>
                            {praca.work_start}
                    </Table.Cell>
                    <Table.Cell>
                            <Button type='button' icon onClick={(evt) => handlePrzerwijPrace(praca.id)}
                            >
                                <Icon name='send' />
                                Przerwij pracę
                            </Button>
                            <Button type='button' icon onClick={(evt) => handleZakonczPrace(praca.id)}
                                disabled={true}
                            >
                                <Icon name='send' />
                                Zakończ pracę
                            </Button>
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
        </Table>
    )
}

export default RaportowanieForm
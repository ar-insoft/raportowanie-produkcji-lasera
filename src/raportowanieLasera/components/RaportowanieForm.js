import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, List, Header, Confirm, Icon, Segment, Item } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import classNames from 'classnames/bind'
import preval from 'preval.macro'
//import { FormattedMessage } from 'react-intl'
import logo from '../../bar-code.png';
import './RaportowanieForm.css'
import RaportujLaser from '../modules/RaportujLaser'
import DataProvider from '../modules/DataProvider'
import DetaleForm from './DetaleForm'
import InformacjeZSerwera from './InformacjeZSerwera'
import { afterSecondsOf, countDownSecondsOnTickOnComplete } from '../modules/Timers'
import ConfirmButton from './ConfirmButton'
//import InnerState from '../../tools/InnerState'
import { Tlumaczenia } from '../../tools/Tlumaczenia'

class RaportowanieForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            raportujLaser: new RaportujLaser(),
            wlasnieOdczytanoPracownika: false,
            odswiezenieStronyZa: 0,
            odswiezenieStronySubscription: null
        }

        this.textInput_liczba_powtorzen = React.createRef();
        this.scanInputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
        DataProvider.testKonfiguracji(fromServer => {
            //console.log('RaportowanieForm.componentDidMount', !fromServer.konfiguracja_poprawna, fromServer)
            if (!fromServer.konfiguracja_poprawna) {
                this.state.raportujLaser.serverInfo = { error: fromServer.bledy_konfiguracji }
                //console.log('RaportowanieForm.componentDidMount', this.state.raportujLaser.serverInfo)
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer) })
            }
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        //console.log('RaportowanieForm.handleChange (' + name + ', ' + value + ')')
        this.setState({ raportujLaser: this.state.raportujLaser.setter({ [name]: value }) });
    }

    handleKeyOnScan = (event) => {
        var char = event.which || event.keyCode;
        //console.log('handleKeyOnScan '+ char)
        if (char === 13) this.handleScan()
        else this.wyswietlLicznikIOdswiezStroneZa(30);
    }

    rozpocznijLaczenieZSerwerem = () => {
        this.zatrzymajLicznikOdswiezeniaStrony();
        this.setState({ isLoading: true, raportujLaser: Object.assign(this.state.raportujLaser, { serverInfo: {} }) })
    }

    handleScan = () => {
        this.rozpocznijLaczenieZSerwerem()
        this.state.raportujLaser.wyslijNaSerwer({},
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false })

                if (fromServer.serverInfo && fromServer.serverInfo.cause) {
                    toast.error(<span>Błąd: {fromServer.serverInfo.cause}</span>);
                }
                if (fromServer.serverInfo && fromServer.serverInfo.error === 'Nie znaleziono pracownika lub programu') {
                    this.wyswietlLicznikIOdswiezStroneZa(4);
                }
                else {
                    if (fromServer.wlasnieOdczytano === 'pracownik') {
                        this.setState({ wlasnieOdczytanoPracownika: true })
                        afterSecondsOf(3).subscribe(x => this.setState({ wlasnieOdczytanoPracownika: false }))
                    }
                    this.wyswietlLicznikIOdswiezStroneZa(30);
                    this.resetujPoleTekstoweSkanowania();
                    this.focusPoleTekstoweSkanowania();
                }
            }, error => {
                toast.error(<span>Błąd: {error.error_message}</span>);
                if (error.errorCause) toast.error(<span>Błąd: {error.errorCause}</span>);
                this.setState({ isLoading: false })
            })
    }
    handleScan3 = () => {
        this.setState({ isLoading: true })
        DataProvider.wyslijSkanNaSerwer(this.state.raportujLaser, {},
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false })
                if (fromServer.wlasnieOdczytano === 'pracownik') {
                    this.setState({ wlasnieOdczytanoPracownika: true })
                    afterSecondsOf(3).subscribe(x => this.setState({ wlasnieOdczytanoPracownika: false }))
                }
            }, error => {
                toast.error(<span>Błąd: {error}</span>);
                this.setState({ isLoading: false });
            })
    }

    handleRozpocznijPrace = () => {
        this.rozpocznijLaczenieZSerwerem()
        this.resetujPoleTekstoweSkanowania();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujLaser.wyslijNaSerwer(
            { rozpocznij_prace: 1 },
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                toast.error(<span>Błąd: {error}</span>);
                this.setState({ isLoading: false });
            })
    }

    handlePrzerwijPrace = (idPraceLaser, stanowisko) => {
        this.rozpocznijLaczenieZSerwerem();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujLaser.wyslijNaSerwer({ przerwij_prace: idPraceLaser, stanowisko: stanowisko },
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                toast.error(<span>Błąd: {error}</span>);
                this.setState({ isLoading: false });
            })
    }

    handleZakonczPrace = (idPraceLaser) => {
        this.rozpocznijLaczenieZSerwerem();
        this.focusPoleTekstoweSkanowania();

        this.state.raportujLaser.wyslijNaSerwer({ zakoncz_prace: idPraceLaser },
            fromServer => {
                this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, fromServer), isLoading: false });
                this.wyswietlLicznikIOdswiezStroneZa(30);
            }, error => {
                toast.error(<span>Błąd: {error}</span>);
                this.setState({ isLoading: false });
            })
    }

    handleRaport = () => {

    }

    setScan = (value) => {
        this.setState({ raportujLaser: this.state.raportujLaser.setter({ scanInput: value }) });
        //this.textInput_liczba_powtorzen.current.focus()
    }

    wyswietlLicznikIOdswiezStroneZa(poIluSekundach) {
        this.zatrzymajLicznikOdswiezeniaStrony();

        this.ustawLicznikOdswiezaniaStrony(poIluSekundach);
    }

    zatrzymajLicznikOdswiezeniaStrony() {
        if (this.state.odswiezenieStronySubscription) {
            this.state.odswiezenieStronySubscription.unsubscribe();
            this.setState({ odswiezenieStronySubscription: null, odswiezenieStronyZa: 0 });
        }
    }

    ustawLicznikOdswiezaniaStrony(poIluSekundach) {
        let subscription = countDownSecondsOnTickOnComplete(poIluSekundach, s => this.setState({ odswiezenieStronyZa: s - 1 }), () => {
            this.setState({ raportujLaser: new RaportujLaser(), odswiezenieStronyZa: 0 });
            this.focusPoleTekstoweSkanowania();
        });
        this.setState({ odswiezenieStronySubscription: subscription });
    }

    resetujPoleTekstoweSkanowania() {
        this.setState({ raportujLaser: Object.assign(this.state.raportujLaser, { scanInput: '' }) });
    }

    focusPoleTekstoweSkanowania() {
        this.scanInputRef.current.focus();
    }

    pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    formatDate = (date) => {
        return date.getUTCFullYear() + '-' + this.pad(date.getUTCMonth() + 1) + '-' + this.pad(date.getUTCDate())
    }

    render() {
        const { raportujLaser } = this.state
        const { scanInput, liczba_powtorzen, employee, } = raportujLaser
        const pracownikOdczytany = raportujLaser.isPracownikOdczytany()
        const programOdczytany = raportujLaser.isProgramOdczytany()
        const buildDate = preval`module.exports = new Date();`
        //console.log('programOdczytany ' + programOdczytany)

        return (
            <Container textAlign='center'>
                <Form autoComplete="off" loading={this.state.isLoading}>
                    <Header as='h2' id={preval`module.exports = new Date();`}>
                        <Tlumaczenia id="Raportowanie produkcji lasera – SAP" />
                            <span className="timestamp">{buildDate.substr(0, 10)}</span>
                    </Header>
                    <Segment.Group>
                        <Segment compact>
                            <div style={{ display: 'flex' }}>
                                <Item.Group>
                                    <Item className='scan'>
                                        <Item.Image size='tiny' src={logo} />

                                        <Item.Content>
                                            <Item.Header><Tlumaczenia id="Zeskanuj.kod" />: </Item.Header>
                                            {/* <Item.Meta>
                                        <span className='price'>$1200</span>
                                        <span className='stay'>1 Month</span>
                                    </Item.Meta> */}
                                            <Item.Description>
                                                <Input id='form-input-scanInput' name="scanInput" value={scanInput} type='text'
                                                    autoFocus ref={this.scanInputRef}
                                                    onChange={this.handleChange}
                                                    onKeyDown={this.handleKeyOnScan}
                                                />
                                                <Button icon onClick={(evt) => this.handleScan()} type='button'>
                                                    <Icon name='search' />
                                                </Button>
                                            </Item.Description>
                                            <OdswiezenieStronyZa sekund={this.state.odswiezenieStronyZa} />
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                <InformacjeZSerwera raportujLaser={this.state.raportujLaser} />
                            </div>
                        </Segment>
                        <AkcjeTestowe parent={this} visible={this.state.raportujLaser.SerwerDewepolerski} />
                        <Segment>
                            <Table celled striped>
                                <Table.Body>
                                    <Table.Row key='pracownik'>
                                        <Table.Cell width={1}>
                                            <Tlumaczenia id="Pracownik" />
                                    </Table.Cell>
                                        <Table.Cell width={3} className={classNames(
                                            {
                                                'niepoprawne_dane': !pracownikOdczytany,
                                                'odczytano_dane': this.state.wlasnieOdczytanoPracownika,
                                            })}>
                                            {pracownikOdczytany ? raportujLaser.getEmployeeFulname() : <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='prace'>
                                        <Table.Cell>
                                            <Tlumaczenia id="Trwające prace" />
                                    </Table.Cell>
                                        <Table.Cell>
                                            {pracownikOdczytany
                                                ?
                                                <TrwajacePrace raportujLaser={raportujLaser}
                                                    handlePrzerwijPrace={this.handlePrzerwijPrace}
                                                    handleZakonczPrace={this.handleZakonczPrace} />
                                                : ''}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='program'>
                                        <Table.Cell>
                                            Program
                                    </Table.Cell>
                                        <Table.Cell className={
                                            programOdczytany ? '' : 'niepoprawne_dane'}>
                                            {programOdczytany ?
                                                <Program raportujLaser={raportujLaser} handleRozpocznijPrace={this.handleRozpocznijPrace} />
                                                :
                                                <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='detaleProgramu'>
                                        <Table.Cell>
                                            <Tlumaczenia id="Detale programu" />
                                    </Table.Cell>
                                        <Table.Cell className={programOdczytany ? '' : 'niepoprawne_dane'}>
                                            {programOdczytany ?
                                                <DetaleForm raportujLaser={raportujLaser} handleRozpocznijPrace={this.handleRozpocznijPrace} />
                                                :
                                                <Tlumaczenia id="brak" />}
                                        </Table.Cell>
                                    </Table.Row>
                                    {/* <Table.Row key='liczba_powtorzen' disabled>
                                        <Table.Cell>
                                        Liczba powtórzeń
                                    </Table.Cell>
                                        <Table.Cell className={programOdczytany ? '' : 'niepoprawne_dane'}>
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
                                </Table.Row> */}
                                </Table.Body>
                            </Table>
                            <a href="/eoffice/production/raportowanie_produkcji_lasera/lista_prac_laser.xml?action=list&raportowanie_produkcji=true">
                                <Tlumaczenia id="Lista prac lasera" />
                            </a>
                        </Segment>
                    </Segment.Group>
                </Form>
            </Container>
        )
    }
}

const AkcjeTestowe = (props) => {
    const { parent, visible } = props
    if (visible) return (
        <Segment >
            <Button icon onClick={(evt) => { parent.setScan(90065200); parent.handleScan() }} type='button'>
                <Icon name='external' />
                Mariusz Kozłowski
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan(90065201); parent.handleScan() }} type='button'>
                <Icon name='external' />
                Łukasz Silwanowicz
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan('171121_2_304L_1'); parent.handleScan() }} type='button'>
                <Icon name='external' />
                171121_2_304L_1
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan('180517_2_304L_4'); parent.handleScan() }} type='button'>
                <Icon name='external' />
                180517_2_304L_4
                            </Button>
            <Button icon onClick={(evt) => { parent.setScan('2_1'); parent.handleScan() }} type='button'>
                <Icon name='external' />
                2_1
                            </Button>
        </Segment>
    )
    return null
}

class Program extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmRozpocznijPrace: false,
        }
    }
    handleButtonRozpocznijPrace = () => {
        const { raportujLaser, handleRozpocznijPrace } = this.props
        if (raportujLaser.czyPracownikMaRozpoczetePrace()) {
            this.setState({ showConfirmRozpocznijPrace: true })
        } else {
            handleRozpocznijPrace()
        }
    }
    handleConfirmRozpocznijPrace = () => {
        this.setState({ showConfirmRozpocznijPrace: false })
        this.props.handleRozpocznijPrace()
    }
    render() {
        const { raportujLaser, handleRozpocznijPrace } = this.props
        const { kartaProgramu, employee, } = raportujLaser
        const pracownikOdczytany = raportujLaser.isPracownikOdczytany()
        const programOdczytany = raportujLaser.isProgramOdczytany()
        const czyPracownikPracujeJuzNadProgramem = raportujLaser.czyPracownikPracujeJuzNadProgramem(kartaProgramu.idProgramu)
        const pracownik = raportujLaser.getEmployeeFulname()
        const confirmContent = `Pracownik ${pracownik}, ma już rozpoczęte i niezakończone raportowanie prac. Czy rozpocząć nowe raportowanie?`
        return (
            <div>
                <Segment.Group horizontal basic>
                    <Segment>
                        <List>
                            <List.Item>
                                <List.Icon name='laptop' />
                                <List.Content><Tlumaczenia id="Zlecenie" />: {kartaProgramu.nazwaZlecenia}</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='industry' />
                                <List.Content>Maszyna: {kartaProgramu.maszyna}</List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Button type='button' icon onClick={(evt) => this.handleButtonRozpocznijPrace()}
                            disabled={!pracownikOdczytany || !programOdczytany || czyPracownikPracujeJuzNadProgramem}
                        >
                            <Icon name='send' />
                            <Tlumaczenia id="Rozpocznij pracę" />
                        </Button>
                        <Confirm dimmer='inverted'
                            open={this.state.showConfirmRozpocznijPrace}
                            content={confirmContent}
                            cancelButton='Anuluj'
                            confirmButton="Rozpocznij pracę"
                            onCancel={(evt) => this.setState({ showConfirmRozpocznijPrace: false })}
                            onConfirm={this.handleConfirmRozpocznijPrace}
                        />
                    </Segment>
                </Segment.Group>
            </div >
        )
    }
}

const TrwajacePrace = (props) => {
    const { raportujLaser, handlePrzerwijPrace, handleZakonczPrace } = props
    const { pracePracownika, } = raportujLaser

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.Cell>
                        Program
                </Table.Cell>
                    <Table.Cell>
                        <Tlumaczenia id="Rozpoczęcie" />
                </Table.Cell>
                    <Table.Cell>
                        <Tlumaczenia id="Akcje" />
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
                            <ConfirmButton onClick={(evt) => handlePrzerwijPrace(praca.id, 'LASER')}
                                content={<Tlumaczenia id="Przerwij pracę LASER" />}
                                useConfirm={praca.czyProgramNiedawnoRozpoczety === true}
                                confirmContent="Program został niedawno rozpoczęty. Czy na pewno chcesz go przerwać?"
                                cancelButton='Anuluj' //{<Tlumaczenia id="Anuluj" />}
                                confirmButton='Przerwij pracę' //{<Tlumaczenia id="Przerwij pracę" />}
                            />
                            <ConfirmButton onClick={(evt) => handlePrzerwijPrace(praca.id, 'LAS_SUPP')}
                                content={<Tlumaczenia id="Przerwij pracę LAS_SUPP" />}
                                useConfirm={praca.czyProgramNiedawnoRozpoczety ===  true}
                                confirmContent="Program został niedawno rozpoczęty. Czy na pewno chcesz go przerwać?"
                                cancelButton='Anuluj' //{<Tlumaczenia id="Anuluj" />}
                                confirmButton='Przerwij pracę' //{<Tlumaczenia id="Przerwij pracę" />}
                            />
                            {/* <ConfirmButton onClick={(evt) => handleZakonczPrace(praca.id)}
                                disabled={praca.trwajaInnePrace} content="Zakończ pracę"
                                useConfirm={true}
                                confirmContent="Program został niedawno rozpoczęty. Czy na pewno chcesz go zakończyć?"
                                cancelButton='Anuluj'
                                confirmButton="Zakończ pracę"
                            /> */}
                            {/* <InnerState state={{ showConfirm: false, }}
                                render={(innerState, setInnerState) => (
                                    <React.Fragment>
                                        <Button type='button' icon onClick={(evt) => setInnerState({ showConfirm: true })}
                                            disabled={praca.trwajaInnePrace}
                                        >
                                            <Icon name='send' />
                                            Zakończ pracę innerState
                                        </Button>
                                        <Confirm dimmer='inverted'
                                            open={innerState.showConfirm}
                                            content="Program został niedawno rozpoczęty. Czy na pewno chcesz go zakończyć?"
                                            cancelButton='Anuluj'
                                            confirmButton="Zakończ pracę"
                                            onCancel={(evt) => setInnerState({ showConfirm: false })}
                                            onConfirm={(evt) => handleZakonczPrace(praca.id)}
                                        />
                                    </React.Fragment>
                                )}
                            /> */}
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}

const OdswiezenieStronyZa = props => (
    <React.Fragment>
        <span className='odswiezStroneZa'> </span>
        {props.sekund > 0 && <span><Tlumaczenia id="Odświeżenie strony za" /> {props.sekund}</span>}
    </React.Fragment>
);

export default RaportowanieForm
import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, List, Header, Label, Icon, Segment, Item } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'
import './DetaleForm.css'

class DetaleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
    }

    render() {
        const { raportujLaser, } = this.props
        const { kartaProgramu, employee, } = raportujLaser

        return (
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign='center'>
                            Nr czesci
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Zlecenie
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Komponent
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Operacja
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Współczynnik czasu
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        kartaProgramu.detale.map(detal => {
                            return (
                                <Table.Row key={detal.nrCzesci}>
                                    <Table.Cell warning textAlign='center'>
                                        <span className='detalMainInfo'>{detal.nrCzesci}</span>
                                        {detal.poprawnyDoRaportowania ? <Icon color='green' name='check' /> : <Icon color='red' name='exclamation circle' />}
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' title={detal.bladWyznaczaniaIndeksuZlecenia}
                                        className={classNames(
                                        {
                                                'odczytano_dane': detal.poprawnyDoRaportowania, //detal.idZleceniaProedims > 0,
                                                'niepoprawne_dane': !detal.poprawnyDoRaportowania //detal.bladWyznaczaniaIndeksuZlecenia
                                            })}>
                                        <span className='detalMainInfo'>{detal.indexZleceniaProedims}</span>
                                        <DetalAdditionalInfo visible={!detal.idZleceniaProedims} detal={detal} info={detal.title} error={detal.bladWyznaczaniaIndeksuZlecenia || 'Brak zlecenia'} />
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' title={detal.bladWyznaczaniaIndeksuKomponentu}
                                        className={classNames(
                                        {
                                            'odczytano_dane': detal.poprawnyDoRaportowania,
                                            'niepoprawne_dane': !detal.poprawnyDoRaportowania, //detal.bladWyznaczaniaIndeksuKomponentu
                                        })}>
                                        {detal.indexKomponentuProedims}
                                        <DetalAdditionalInfo visible={!detal.idKomponentProedims} error={detal.bladWyznaczaniaIndeksuKomponentu || 'Brak komponentu'} />
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' title={detal.bladWyznaczaniaIndeksuKomponentu}
                                        className={classNames(
                                            {
                                                'odczytano_dane': detal.poprawnyDoRaportowania, //detal.idOperacjaProedims > 0,
                                                'niepoprawne_dane': !detal.poprawnyDoRaportowania, //detal.bladWyznaczaniaIndeksuKomponentu
                                            })}>
                                        {detal.operacjaProedimsInfo}
                                        <DetalAdditionalInfo visible={!detal.poprawnyDoRaportowania} error={!detal.idOperacjaProedims ? 'Brak operacji' : 'Operacja zakończona'} />
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' className={classNames(
                                        {
                                            'odczytano_dane': detal.poprawnyDoRaportowania,
                                            'niepoprawne_dane': !detal.poprawnyDoRaportowania,
                                        })}>
                                        {_.round(detal.wspolczynnikCzasuMaszyny * 100) + ' %'}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}

const DetalAdditionalInfo = (props) => {
    const { visible, error } = props
    if (visible) return (
        <React.Fragment>
            <div className='detalError'>{error}</div>
            {/* <div className='detalError'>error</div>
            {detal.idZleceniaProedims > 0 ? <Icon color='green' name='check' /> : <Icon color='red' name='exclamation triangle' />} */}
        </React.Fragment>
    )
    return null
}

export default DetaleForm
import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, List, Header, Label, Icon, Segment, Item } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'

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
                                        {detal.nrCzesci} <Icon color='red' name='exclamation' />
                                        <Icon color='red' name='exclamation circle' /><Icon color='red' name='exclamation triangle' />
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' title={detal.bladWyznaczaniaIndeksuZlecenia}
                                        className={classNames(
                                        {
                                            'odczytano_dane': detal.idZleceniaProedims > 0,
                                            'niepoprawne_dane': detal.bladWyznaczaniaIndeksuZlecenia
                                        })}>
                                        {detal.indexZleceniaProedims}
                                    </Table.Cell>
                                    <Table.Cell textAlign='center' title={detal.bladWyznaczaniaIndeksuKomponentu}
                                        className={classNames(
                                        {
                                            'odczytano_dane': detal.idOperacjaProedims > 0,
                                            'niepoprawne_dane': detal.bladWyznaczaniaIndeksuKomponentu
                                        })}>
                                        {detal.indexKomponentuProedims}
                                    </Table.Cell>
                                    <Table.Cell textAlign='center'>
                                        {_.round(detal.wspolczynnikCzasuMaszyny * 100) + ' %'}
                                        <Icon color='green' name='check' />
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

export default DetaleForm
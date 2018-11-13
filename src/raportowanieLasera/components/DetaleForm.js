import React, { Component } from 'react'
import { Form, Input, Button, Table, Container, List, Header, Label, Icon, Segment, Item } from 'semantic-ui-react'

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
        return (
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell>
                            nrCzesci
                        </Table.Cell>
                        <Table.Cell>
                            indexZleceniaProedims
                        </Table.Cell>
                        <Table.Cell>
                            indexKomponentuProedims
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                </Table.Body>
            </Table>
        )

    }
}

export default DetaleForm
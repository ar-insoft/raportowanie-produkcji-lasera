import React, { Component } from 'react'
import classNames from 'classnames/bind'

const InformacjeZSerwera = (props) => {
    const { raportujLaser } = props
    const error = raportujLaser.serverInfo && raportujLaser.serverInfo.error
    const ok = raportujLaser.serverInfo && raportujLaser.serverInfo.ok
    console.log('InformacjeZSerwera: ' + (raportujLaser.serverInfo && (raportujLaser.serverInfo.error || raportujLaser.serverInfo.ok)))

    // if (raportujLaser.wlasnieOdczytano === 'pracownik') {
    //     return (
    //         <div className='server_info odczytano_dane'>
    //             <div style={{ margin: 'auto', verticalAlign: 'middle', height: 100+'%' }}>
    //             Odczytano pracownika
    //             </div>
    //         </div>
    //     )        
    // }

    return (
        <div className={classNames(
            {
                'server_info': true,
                'niepoprawne_dane': error,
                'odczytano_dane': ok,
            })}>
            {raportujLaser.serverInfo && (raportujLaser.serverInfo.error || raportujLaser.serverInfo.ok)}
        </div>
        )
}

export default InformacjeZSerwera
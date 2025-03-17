import React from 'react'
import { ClientProvider  } from '../../../context/ClientContext'
import { BDProjectsAssignedProvider } from "../../../context/BDProjectsassigned"; 
import { Assigned } from './Assigned'
import { Assignedtable } from './Assignedtable'

export const Assignedelement = () => {
  return (
    <div>
        <ClientProvider >
            <BDProjectsAssignedProvider >
                <Assigned/>
                <Assignedtable/>
            </BDProjectsAssignedProvider >
          </ClientProvider >
    </div>
  )
}

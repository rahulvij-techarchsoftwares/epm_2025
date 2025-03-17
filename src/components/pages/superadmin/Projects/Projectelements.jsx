import React from 'react'
import { ClientProvider  } from '../../../context/ClientContext'
import { ProjectProvider  } from '../../../context/ProjectContext'
import { Projects } from './Projects'
import { Projecttable } from './Projecttable'


export const Projectelements = () => {
  return (
    <div>
        <ClientProvider >
        <ProjectProvider>
                <Projects/>
                <Projecttable/>
                </ProjectProvider>
            </ClientProvider >
    </div>
  )
}

<script setup lang="ts"> 
import {onMounted, ref} from 'vue'
import {RouterLink} from 'vue-router'

interface Case{
    case_id: number
    client_id: number
    title: string
    description: string
    category: string
    priority: string
    status: string
    created_at: string 
}

// retrieve information of many cases
const cases = ref<Case[]>([])

async function fetchCases() {
    try{
        const response = await fetch('http://localhost:3000/cases')

        if (!response.ok){
            throw new Error('Failed to retrieve cases')
        }

        const data: Case[] = await response.json()
        cases.value = data 
    }catch (error){
        console.error('Failed to retrieve cases:', error)
    }
}

onMounted(() => {
    fetchCases()

})


</script>

<template>
    <main> 
        <h1>Cases</h1>
        <p>Manage legal cases from this page</p>

          <RouterLink to="/cases/new">    
                Create Case
          </RouterLink>

        <div v-for="caseItem in cases" :key="caseItem.case_id">
                  
            <h2>{{caseItem.title}}</h2>

            <p>Case ID: {{caseItem.case_id}}</p>
            <p>Client ID: {{caseItem.client_id}}</p>
            <p>Category: {{caseItem.category}}</p>
            <p>Priority: {{caseItem.priority}}</p>
            <p>Status: {{caseItem.status}}</p>
            <p>Description: {{caseItem.description}}</p>

                <RouterLink :to="`/cases/${caseItem.case_id}`">    
                View Case
                </RouterLink>
        </div> 

    </main>
</template> 
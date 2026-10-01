<script setup lang="ts">
import {ref} from 'vue'

import {useRouter} from 'vue-router'

const clientId = ref<number | null>(null)
const title = ref('')
const description = ref('')
const category = ref('')
const priority = ref('')

const router = useRouter()

async function createCase(){
    try{
        const response = await fetch('http://localhost:3000/cases',{
            method: 'POST',

            headers:{
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify({
                clientId: clientId.value,
                title: title.value,
                description: description.value,
                category: category.value,
                priority: priority.value,
            }), 
        })

        if (!response.ok){
            throw new Error('Failed to create a case')
        }
        
        const newCase = await response.json()

        router.push(`/cases/${newCase.case_id}`)
    }catch(error){
        console.error('Failed to create case', error)
    }
}



</script>

<template>
    <main>
        <h1>Create Case</h1>
        <p>Create a new legal case</p>

        <form @submit.prevent="createCase">
            <div>
                <label for="clientId">Client ID</label>
                <input
                    id="clientId"
                    v-model.number="clientId" 
                    type="number"
                    min="1"  
                    required
                    /> 
            </div>

            <div>
                <label for="title">Title</label>
                <input
                    id="title"
                    v-model="title"
                    type="text"
                    required
                /> 
            </div>

            <div>
                <label for="description">Description</label>
                <textarea
                    id="description"
                    v-model="description"
                    required

                ></textarea>
            </div>

            <div>
                <label for="category">Category</label>
                <select id="category" v-model="category" required>
                    <option value="">Select category</option>
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Family">Family</option>
                    <option value="Employment">Employment</option>
                    <option value="Property">Property</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Other">Other</option>

                </select>
            </div>

            <div>
                <label for="priority">Priority</label>
                <select id="priority" v-model="priority" required>
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <button type="Submit"> Create Case</button>
        </form>

    </main>
</template>
<script setup lang="ts"> 
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()

const router = useRouter()

const caseId = route.params.id

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
// retrieve information of just one case 
const caseItem = ref<Case | null>(null)

const isEditing = ref(false)
    
const editTitle = ref('')
const editDescription = ref('')
const editCategory = ref('')
const editPriority = ref('')
const editStatus = ref('')

function startEditing(){
    if (!caseItem.value){
        return
    }

    editTitle.value = caseItem.value.title
    editDescription.value = caseItem.value.description
    editCategory.value = caseItem.value.category
    editPriority.value = caseItem.value.priority
    editStatus.value = caseItem.value.status
  
    isEditing.value = true
}

function cancelEditing(){
    isEditing.value = false
}


// case retrieved based on case ID
// the link is accessible if backticks are used, which it is 
async function fetchCase() {
    try{
        const response = await fetch(`http://localhost:3000/cases/${caseId}`)
 

        if (!response.ok){
            throw new Error('Failed to retrieve case')
        }

        const data: Case = await response.json()
        caseItem.value = data 
    }catch (error){
        console.error('Failed to retrieve case:', error)
    }
}

onMounted(() => {
    fetchCase()

})

async function archiveCase(){
    const confirmed = window.confirm(
        "Are you sure you want to archive this case?"
    )
    if (!confirmed){
        return
    }
    
    try{
        const response = await fetch(`http://localhost:3000/cases/${caseId}`,{
            method: 'DELETE',
        })

        if(!response.ok){
            throw new Error('Failed to archive case')
        }

        router.push('/cases')
    }catch(error){
        console.error('Failed to archive case:', error)
    }
}

</script>

<template>
    <main>
   <h1>Case Details</h1>

        <div v-if="caseItem">

        <div v-if="!isEditing">
            <h2>{{caseItem.title}}</h2>

            <p>Case ID: {{caseItem.case_id}}</p>
            <p>Client ID: {{caseItem.client_id}}</p>
            <p>Category: {{caseItem.category}}</p>
            <p>Priority: {{caseItem.priority}}</p>
            <p>Status: {{caseItem.status}}</p>
            <p>Description: {{caseItem.description}}</p>

            <button @click="startEditing">
                Edit Case
            </button>

            <button @click="archiveCase">
                Archive Case
            </button>
        </div> 

        <div v-else>
            <h2>Edit case</h2>
            <form>
       <div>
        <label for="editTitle">Title</label>
        <input
            id="editTitle"
            v-model="editTitle"
            type="text"
            required
        />
     </div>

    <div>
        <label for="editDescription">Description</label>
        <textarea
            id="editDescription"
            v-model="editDescription"
            required
        ></textarea>
    </div>

    <div>
        <label for="editCategory">Category</label>
        <select id="editCategory" v-model="editCategory">
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
        <label for="editPriority">Priority</label>
        <select id="editPriority" v-model="editPriority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>
    </div>

    <div>
        <label for="editStatus">Status</label>
        <select id="editStatus" v-model="editStatus">
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Open">Open</option>
            <option value="On Hold">On Hold</option>
            <option value="Closed">Closed</option>
        </select>
    </div>

    <button type="button" @click="cancelEditing">
        Cancel
    </button>
    </form>
        
    </div>
    </div>
        <p v-else>Loading case...</p>
    </main>
</template> 
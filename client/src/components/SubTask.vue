<template>
    <div>
        <!--<span id="close" class="destroy" @click="CLOSE_DIV(filteredTodo)">
            <i class="fa fa-close"></i>
        </span>-->
        <text-description :id="id" :filteredTodo="filteredTodo">
        </text-description>
        <main-left-section 
        v-if="!$store.state.deleteItemsSelected && id !== 'rightTaskTypes' && id !== 'rightTaskState'" 
        :pholder="pholder" :filtered-todos="filteredTodos"></main-left-section>
    </div>
</template>
<script>
/* eslint-disable*/
import Vue from 'vue'
import TextDescription from './TextDescription.vue'
import MainLeftSection from './MainLeftSection.vue'
import { mapMutations, mapGetters } from 'vuex'
export default {
    props: ['filteredTodos', 'pholder',  'isCopyLink', 'id', 'filteredTodo'],
    data: function() {
        return {
            taskObject: this.filteredTodo
        }
    },
    methods: {
        ...mapMutations([
            'CLOSE_DIV'
        ]),
    },
    methods: {
        ...mapMutations([
            'CLOSE_DIV'
        ]),

    },
    components: {
        TextDescription,
        MainLeftSection
    }
}
</script>

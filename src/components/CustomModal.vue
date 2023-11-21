<template>
    <Transition name="modal">
        <div class="modal__bg" v-if="isModalOpen">
            <div class="modal" ref="modal">
                <div class="modal__header">
                    <button @click="emit('closeModal')" class="modal__close-btn">+</button>
                </div>
                <div class="modal__body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps(['isModalOpen']);
const emit = defineEmits(['closeModal']);

const modal = ref(null);

onClickOutside(modal, () => emit('closeModal'));
</script>

<style lang="scss">
.modal {
    position: relative;
    padding: 40px 30px 30px;

    width: auto;
    min-width: 300px;
    max-width: 600px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.15);
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #444;
    margin-top: 0;

    @media (max-width: 640px) {
        width: calc(100vw - 30px);
        max-width: 300px;
    }

    &__bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__header {
        max-height: 3rem;
    }

    &__body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    &__close-btn {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 5px;
        right: 5px;

        background: none;
        border: none;
        cursor: pointer;
        font-size: 24px;
        line-height: 30px;
        color: rgba(0, 0, 0, 0.6);
        transform: rotate(45deg);

        &:hover {
            color: rgba(0, 0, 0, 0.8);
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(1.1);
}
</style>

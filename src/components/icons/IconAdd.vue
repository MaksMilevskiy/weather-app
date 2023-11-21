<template>
    <svg
        width="30px"
        height="30px"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        :fill="color"
        :stroke="color"
        @mouseover="color = '#000d85'"
        @mouseleave="color = '#3498db'"
    >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="1.024"
        />

        <g id="SVGRepo_iconCarrier">
            <title>Icon add</title>

            <path
                d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z"
                style="fill: none; stroke-miterlimit: 10; stroke-width: 32px"
                :style="{ stroke: color }"
            />

            <line
                x1="256"
                y1="176"
                x2="256"
                y2="336"
                style="
                    fill: none;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 32px;
                "
                :style="{ stroke: color }"
            />

            <line
                x1="336"
                y1="256"
                x2="176"
                y2="256"
                style="
                    fill: none;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 32px;
                "
                :style="{ stroke: color }"
            />
        </g>
    </svg>
</template>

<script setup>
import { ref } from 'vue';

const color = ref('#3498db');
</script>

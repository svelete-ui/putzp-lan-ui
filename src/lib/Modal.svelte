<script lang="ts">
    import { fly, slide } from "svelte/transition";
    import { init, text } from "svelte/internal";
    import next_button from "../assets/next-svgrepo-com.svg";
    import next_button_out from "../assets/next-svgrepo-com_outline.svg";
    import type { TransactionType } from "../types/TransactionType.type";
    import { States } from "../types/States";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const FLY_DIRECTION_CONST = 240;

    let uid = 1;
    let memberUID = 1;
    let roomUID = 1;
    let name = "Meine-WG";
    let members = [];
    let rooms = [];
    let fly_direction = FLY_DIRECTION_CONST;

    let state: States = States.init;
    $: state_is_init = state === States.init;

    function getStateName(state: States) {
        switch (state) {
            case States.init:
                return "flat name";
            case States.members:
                return "member names";
            case States.rooms:
                return "room names";
        }
    }

    let transactions: TransactionType[] = [];

    function nextClick() {
        fly_direction = FLY_DIRECTION_CONST;
        switch (state) {
            case States.init:
                state = States.members;
                dispatch("nameEntered", { name });
                dispatch("statechange", { state });
                break;
            case States.members:
                state = States.rooms;
                dispatch("statechange", { state });
                break;
            default:
                break;
        }
    }
    function prevClick() {
        fly_direction = -1 * FLY_DIRECTION_CONST;
        switch (state) {
            case States.rooms:
                state = States.members;
                dispatch("statechange", { state });
                break;
            case States.members:
                state = States.init;
                dispatch("statechange", { state });
                break;
            default:
                break;
        }
    }
    function setName(value: string) {
        name = value.replaceAll(" ", "-").toUpperCase();
    }

    function add(input) {
        const value = input.value;
        // TODO: validation

        switch (state) {
            case States.init:
                setName(value);
                break;
            case States.members:
                const member = {
                    id: memberUID++,
                    name: value,
                };
                members = [...members, member];
                break;
            case States.rooms:
                const room = {
                    id: roomUID++,
                    name: value,
                };
                rooms = [...rooms, room];
                break;
        }

        // transactions = [
        //     ...transactions,
        //     {
        //         id: uid,
        //         name: "addMember",
        //         data: member,
        //     },
        // ];
        // console.log(JSON.stringify(transactions));

        input.value = "";
    }

    function removeMember(member) {
        members = members.filter((t) => t !== member);
    }
    function removeRoom(room) {
        rooms = rooms.filter((t) => t !== room);
    }
</script>

{#key state}
    <div id="modal">
        <!-- <h5>Unique ID: 00-14-62-58</h5>
        <h5>Name: Grüner Markt</h5>
        <h5>Roomies:</h5>
        <h5>+David</h5>
        <h5>+Yara</h5>
        <h5>+Jonas</h5>
        <h5>Clean stuff:</h5>
        <h5>+Kitchen</h5>
        <h5>+Bathroom</h5>
        <h5>+Terasse</h5> -->

        <!-- <h2>{getStateName(state)}</h2> -->
        <div class="container" in:fly={{ x: fly_direction }}>
            {#if state !== States.init}
                <div class="align-h-center" on:click={prevClick}>
                    <img
                        src={next_button}
                        class="previous-icon logo"
                        alt="prev"
                    />
                </div>
            {:else}
                <div class="logo" />
            {/if}
            <div>
                <h2>
                    <input
                        autofocus
                        on:keydown={(e) => {
                            if (e.key === "Enter") {
                                add(e.target);
                                if (state_is_init) nextClick();
                            }
                        }}
                        on:keyup={(e) =>
                            e.key !== "Enter" &&
                            state_is_init &&
                            setName(e.target.value)}
                        type="text"
                        maxlength="16"
                        value={state_is_init ? name : ""}
                        placeholder="enter"
                    />
                </h2>
            </div>
            {#if state !== States.rooms}
                <div class="align-h-center" on:click={nextClick}>
                    <img
                        src={next_button_out}
                        class="next-icon logo push"
                        alt="next"
                    />
                </div>
            {:else}
                <div class="logo" />
            {/if}
        </div>

        {#if state_is_init}
            <div class="" />
        {:else if state === States.members}
            <div class="">
                {#each members.filter((t) => !t.done) as member (member.id)}
                    <p class="member-entry">
                        {member.name}
                        <button on:click={() => removeMember(member)} />
                    </p>
                {/each}
            </div>
        {:else if state === States.rooms}
            <div class="">
                {#each rooms.filter((t) => !t.done) as room (room.id)}
                    <p class="member-entry">
                        {room.name}
                        <button on:click={() => removeRoom(room)} />
                    </p>
                {/each}
            </div>
        {/if}
    </div>
{/key}

<style>
    #modal {
        /* display: flex; */
        text-align: left;
    }

    .container {
        overflow: visible;
        background-color: rgb(240, 240, 240);
        padding: 15px;
        margin-top: 0.25em;
        margin-bottom: 1em;
        border-radius: 10px;
        /* border-style: outset; */
        /* border-width: 1px; */
        /* border-color: rgb(110, 110, 110); */
        display: flex;
        text-align: center;
        justify-content: space-between;
        align-content: center;
        align-items: center; /* align vertical */
    }

    .push {
        margin-left: auto;
    }
    .previous-icon {
        transform: rotate(180deg);
    }

    h2 {
        /* border-bottom-style: double;
        border-bottom-width: 2px;
        border-bottom-color: black; */
        font-size: xx-large;
        margin-block-start: 0px;
        margin-block-end: 0px;
        /* margin-bottom: 10px; */
    }
    h5 {
        margin: 0px;
        color: rgb(175, 175, 175);
        /* margin-bottom: 30px; */
    }
    input {
        width: 470px;
        height: 50px;

        text-align: center;
        overflow: visible;
        font-size: 56px;
        z-index: -999;
        border-style: none;
        border-width: 0px;
    }
    input:focus {
        outline: none;
    }
    input[type="text"] {
        background: transparent;
        border: none;
        height: 100px;
        text-transform: uppercase;
    }
    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        font-style: italic;
    }
    ::-moz-placeholder {
        /* Firefox 19+ */
        font-style: italic;
    }
    :-ms-input-placeholder {
        /* IE 10+ */
        font-style: italic;
    }
    :-moz-placeholder {
        /* Firefox 18- */
        font-style: italic;
    }

    .align-h-center {
        align-content: stretch;
    }

    .logo {
        height: 2.5em;
        width: 50px;
        padding: 1em;
        will-change: filter;
    }
    .logo:hover {
        filter: drop-shadow(0 0 4em #646cffaa);
    }

    .member-entry {
        position: relative;
        line-height: 1.2;
        padding: 0.5em 2.5em 0.5em 2em;
        margin: 0 0 0.2em 0;
        border-radius: 2px;
        user-select: none;
        background-color: rgb(240, 240, 240);
        color: #333;
        text-transform: uppercase;
        font-size: 56px;
        border-radius: 10px;
    }

    button {
        position: absolute;
        top: 0;
        right: 0.2em;
        width: 2em;
        height: 100%;
        background: no-repeat 50% 50%
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: 1.4em 1.4em;
        border: none;
        opacity: 0.25;
        transition: opacity 0.2s;
        text-indent: -9999px;
        cursor: pointer;
    }

    .member-entry > button:hover {
        opacity: 1;
    }
</style>

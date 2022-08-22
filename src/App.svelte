<script lang="ts">
  import Modal from "./lib/Modal.svelte";
  import { States } from "./types/States";
  import { fly } from "svelte/transition";
  import * as StorageService from "./service/StorageService";
  import * as PutzplanApi from "./api/PutzplanApi";
  import { onMount } from "svelte";

  onMount(async function() {
// check if digitcode is set in storage


    const response = await PutzplanApi.init(StorageService.getMemberId());
    const data = await response.json();
    // StorageService.setMemberId(data.id);
    StorageService.setMemberIdObject({id:data.id});
    
    let memberDigitCode = StorageService.getMemberDigitCode();
    // favs = data.favs;
  });

  function onPutzplanDigitEnter(event) {
    const {eightdigitid} = event.detail;
    // get putzplan via eightdigitid-id
  }


  const FLY_DIRECTION_CONST = 240;

  let name: string = "";
  let state: States = States.init;
  $: state_is_init = state === States.init;

  function updateState(event) {
    state = event.detail.state;
  }
  function updateName(event) {
    name = event.detail.name;
  }
</script>

<main>
  <div class="main-navbar-left">
    <ul>
      <li><h1>PUTZP-LAN</h1></li>
      {#if state === States.before}
        <li in:fly={{ x: FLY_DIRECTION_CONST }}><p class="selected">CREATE NEW</p></li>
      {:else if state_is_init}
        <li in:fly={{ x: FLY_DIRECTION_CONST }}><p class={state_is_init ? "selected" : ""}>ENTER A NAME</p></li>
      {:else if state > States.init}
        <li in:fly={{ x: FLY_DIRECTION_CONST }}><p>{name}</p></li>
      {/if}
      <li><p class={state === States.members ? "selected" : ""}>MEMBERS</p></li>
      <li><p class={state === States.rooms ? "selected" : ""}>ROOMS</p></li>
    </ul>
  </div>
  <div class="card">
    <Modal on:statechange={updateState} on:nameEntered={updateName} />
  </div>
</main>

<style>
  :global(body) {
    display: flex;
    place-items: left !important;
    justify-items: left !important;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 50px;
    padding-bottom: 55px;
    color: rgb(36, 36, 36);
    align-items: center;
    display: inline;
  }

  ul > li > p {
    padding: 5px;
    padding-bottom: 7px;
    padding-right: 10px;
    width: auto;
  }

  .selected {
    border-bottom-style: solid;

    margin-bottom: -1px;
  }

  li > h1 {
    font-size: 64px;
    margin: 0px;
  }

  main {
    display: flex;
    justify-items: left;
    align-items: left;
    flex-direction: row;
    height: 100%;
  }

  .main-navbar-left {
    background-color: rgba(238, 238, 238, 0.185);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    width: 780px;
    padding: 120px 40px;
    text-align: left;
  }
</style>

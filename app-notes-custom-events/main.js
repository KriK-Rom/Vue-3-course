const emitter = mitt();

const inputComponent = {
  template: `<input
        :placeholder='placeholder'
        v-model="input"
        @keyup.enter='monitorEnterKey'
        class="input is-small"
        type="text" />`,
  props: ['placeholder'],
  emits: ['add-note', 'add-error'],
  data() {
    return {
      input: '',
    };
  },
  methods: {
    monitorEnterKey() {
      this.input === ''
        ? emitter.emit('add-error', { error: (error = true) })
        : emitter.emit('add-note', { note: this.input, timestamp: new Date().toLocaleString() });
      this.input = '';
    },
  },
};

const noteCountComponent = {
  template: `<div class="note-count">Note count: <strong>{{ noteCount }}</strong></div>`,
  data() {
    return {
      noteCount: 0,
    };
  },
  created() {
    emitter.on('add-note', (event) => this.noteCount++);
  },
};

const app = {
  data() {
    return {
      notes: [],
      timestamps: [],
      placeholder: 'Enter a note',
      error: false,
    };
  },
  methods: {
    addNote(event) {
      this.notes.push(event.note);
      this.timestamps.push(event.timestamp);
      this.error = false;
    },
    addError(event) {
      this.error = event.error;
    },
  },
  created() {
    emitter.on('add-error', (event) => this.addError(event));
    emitter.on('add-note', (event) => this.addNote(event));
  },
  components: {
    'input-component': inputComponent,
    'note-count-component': noteCountComponent,
  },
};

Vue.createApp(app).mount('#app');
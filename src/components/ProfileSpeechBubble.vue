<template>
  <div class="profile-speech-bubble">
    <div class="img-box">
      <a
        :href="link"
        target="_blank"
      >
        <img
          :src="imageURL"
          alt="lane wagner"
        >
      </a>
      <span class="bio">
        {{ bio }}
      </span>
    </div>
    <span>
      {{ text }}
    </span>
  </div>
</template>


<script>
export default {
  props: { 
    text:{
      type: String,
      required: true
    },
    imageURL:{
      type: String,
      required: true
    },
    link:{
      type: String,
      required: true
    },
    bio:{
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.profile-speech-bubble {
  display: flex;
  flex-direction: row;
  padding: .5em;
  align-items: center;

  .bio {
    font-style: italic;
  }

  .img-box {
    flex: 1;
    img {
      margin: 0 10px 0 0;
      width: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid $gray-darker;
    }
  }
}

</style>

<template>
  <div class="subcontainer">
    <Section
      title="Invite Friends, Get Gems"
      subtitle="Our Referral Program"
      class="section"
    >
      <div class="body">
        <p>
          We think learning is better with friends,
          so for everyone you invite to join,
          you’ll both earn some free gems.

          Copy the link below and give it to your friend.
          When they create their account using this link,
          you'll both get free gems!
        </p>

        <div class="center">
          <p>
            {{ link }}
          </p>

          <p>
            <BlockButton
              :click="copyLink"
            >
              Copy Link
            </BlockButton>
          </p>

          <img
            width="250"
            src="../img/gem-3.png"
          >
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';


export default {
  components: {
    Section,
    BlockButton
  },
  computed:{
    link(){
      return `https://app.qvault.io?ruid=${this.$store.getters.getUser.UUID}`;
    }
  },
  methods: {
    // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    async copyLink() {
      const text = this.link;
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
        this.$notify({
          type: 'success',
          text: 'Copied!'
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      this.$notify({
        type: 'success',
        text: 'Copied!'
      });
    },
    fallbackCopyTextToClipboard(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
  
      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
    }   
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.subcontainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  .section {
    max-width: 800px;

    .body {
      padding: 1em;
    }
  }

  .center{
    text-align: center;
  }
}

</style>

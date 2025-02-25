<script>
    import { useTask, T } from '@threlte/core'

    let rotation = 0;
    useTask((delta) => {
    rotation += delta
  })

</script>

<T.Mesh rotation.z={rotation}>
    <T.BoxGeometry />




</T.Mesh>
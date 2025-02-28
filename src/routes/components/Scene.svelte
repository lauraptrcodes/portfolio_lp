<script>
    import { useTask, T } from '@threlte/core'

    /*let rotation = 0;
    useTask((delta) => {
    rotation += delta
  })*/
    let phase = 0;
    useTask((delta) => {
      phase += delta * 0.2;
      calcPositions();
    })

    const size = 8;
    const count = 400;
    const positions = new Float32Array(count * 3);

    function calcPositions(){
      for (let i = 0; i < count; i++) {
       let x = (i / count) * 8;
       let y = 0;

       const vx = x;
       const vy = Math.sin(4*x + phase) * Math.sin(3*x + phase);

       //x
        positions[i * 3 + 0] = vx - 4;
        //y
        positions[i * 3 + 1] = vy * 4;
        //z
        positions[i * 3 + 2] = 0;
      }
    }

    calcPositions();

</script>


<T.Line>
  <T.BufferGeometry>
    <T.BufferAttribute
      args={[positions, 3]}
      attach={({ parent, ref }) => {
        parent.setAttribute('position', ref)
       
        return () => {
          // cleanup function called when ref changes or the component unmounts
          // https://threlte.xyz/docs/reference/core/t#attach
        }
      }}
    />
  </T.BufferGeometry>
  <!--size={0.05} -->
  <T.LineBasicMaterial color={0x0442BF} linewidth={4} />
</T.Line>

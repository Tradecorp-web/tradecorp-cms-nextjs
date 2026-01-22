import React from "react"

export default class Layout extends React.Component {
    showMessage = () => {
        alert('SOME MESSAGE');
    }
    keydownHandler(e){
        if(e.keyCode===67) {
            navigator.clipboard.readText().then(clipText => {
                console.log(clipText)
                var dummy = document.createElement("textarea");
                document.body.appendChild(dummy);
                var str = "\n\nArtikel ini telah tayang di Tribunnews.com dengan judul Remaja 16 Tahun Tewas setelah Loncat dari Lantai 12 Mal, Diduga Bunuh Diri, Ini Kata Saksi, https://www.tribunnews.com/regional/2021/06/02/remaja-16-tahun-tewas-setelah-loncat-dari-lantai-12-mal-diduga-bunuh-diri-ini-kata-saksi.";
                dummy.value = clipText + str;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
                console.log(clipText)
            })
        }
    }
    componentDidMount(){
        document.addEventListener('keydown', this.keydownHandler);
    }
      componentWillUnmount(){
        document.removeEventListener('keydown', this.keydownHandler);
    }
    render () {
      return (
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </div>
      )
    }
  }
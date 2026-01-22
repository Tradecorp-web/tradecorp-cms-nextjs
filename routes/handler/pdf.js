const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');

const ping = function (req, res) {
    return res.status(200).json({
        code : 200,
        message : "Sehat Mas Alhamdulillah"
    })
}

function dateFormat(date) {
    if (date == null) return "-"
    return moment(date).format('LL')
}

async function getBuffer(url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer;
    } catch (error) {
      return { error };
    }
}

const exportDoRelease = async function (req, res) {
    var id = req.query.id;
    const url = `http://127.0.0.1:1323/do-release/${id}`

    if(id == null) {
        return res.status(404).json({
            code : 404,
            message : "Document not found"
        })
    }
    
    try {
        var response = await fetch(url, {method: "GET"})
        const jsonData = await response.json()
        console.log(jsonData)

        const doc = new PDFDocument({size: 'A4'})
        let filename = "DO-RELEASE";
        filename = encodeURIComponent(filename) + '.pdf'
        //res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
        res.setHeader('Content-type', 'application/pdf')
        doc.rect(0, 0, doc.page.width, 80).fill('#fef12a')
            .rect(0, 80, doc.page.width, 30).fill('#e32e26')
            .image(__dirname+ '/logo.png', 200, 0, {align: 'center', width: 150})
            .moveDown()
            .fillColor('white')
            .fontSize(9)
            .text("PORTA-CAMP CONSTRUCTION DIVISION", {width: 480, align: 'center'})
            .text("PORTA-CABINS OFFSHORE CONTAINERS and SPECIALIZED CONTAINER", {width: 480, align: 'center'})
            .fontSize(10)
            .moveDown()
            .moveDown()
            .fillColor('black')
            .text("Jakarta Office: Jl. Rorotan Babek TNI, No 2-3 Cakung Timur, Jakarta 13910 Indonesia.", {width: 480, align: 'center'})
            .text("Phone: +62-21-4605-021 * Fax: +62-21-4605-028, Email: enquiries@tradecorp.co.id, www.tradecorp.co.id", {width: 480, align: 'center'})
            .fontSize(18)
            .moveDown()
            .fillColor('red')
            .text("DELIVERY ORDER", {width: 480, align: 'center', underline: true})
            .fillColor('black')
            .fontSize(11)
            .moveDown()
            .moveDown()
            .text(`TO : ${jsonData.data.destination.name}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.address}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.city} ${jsonData.data.destination.postal_code}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.country}`, {width: 480, align: 'left'})
            .moveDown()
            .moveDown()
            .text("ATTN                 : Mr Steve/08210023222", {width: 480, align: 'left'})
            .moveDown()
            .text(`Release Date             : ${dateFormat(jsonData.data.release_date)}`, {width: 480, align: 'left'})
            .moveDown()
            .text(`Expired Date              : ${dateFormat(jsonData.data.expired_date)}`, {width: 480, align: 'left'})
            .moveDown()
            .text(`Release Number       : ${jsonData.data.release_number}`, {width: 480, align: 'left'})
            .moveDown()
            .text("You Are Authorized to Release   : 32x20' GP Dry", {width: 480, align: 'left'})
            .moveDown()
            .text("Unit Number Containers             : TBA", {width: 480, align: 'left'})
            .moveDown()
            .moveDown()
            .text(
                `Please release this unit for our customer to ${jsonData.data.customer.company} and thankyou for your kind and attention.`, 
                {width: 480, align: 'left'}
            )
            .moveDown()
            .moveDown()
            .moveDown()
            .text("Best Regards,", {width: 480, align: 'left'})
            .moveDown()
            .moveDown()
            .moveDown()
            .text(`${jsonData.data.signature.name}`, {width: 480, align: 'left'})
            .fontSize(14)
            .fillColor('red')
            .text(`${jsonData.data.company.name}`, {width: 480, align: 'left'})
            .fillColor('black')
            .fontSize(11)
            .moveDown()
            .moveDown()
            .moveDown()
        doc.pipe(res)
        doc.end()
        return
    } catch (error) {
        console.log(error)
    }
}

const exportDoAcceptance = async function (req, res) {
    var id = req.query.id;
    const url = `http://127.0.0.1:1323/do-acceptance/${id}`

    if(id == null) {
        return res.status(404).json({
            code : 404,
            message : "Document not found"
        })
    }

    try {
        var response = await fetch(url, {method: "GET"})
        const jsonData = await response.json()
        console.log(jsonData)

        const doc = new PDFDocument({size: 'A4'})
        let filename = "DO-RELEASE";
        filename = encodeURIComponent(filename) + '.pdf'
        //res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
        res.setHeader('Content-type', 'application/pdf')

        const buff = await  getBuffer("https://kontainerindonesia.co.id/wp-content/uploads/2021/03/tradecorp-logo.png")

        doc.rect(0, 0, doc.page.width, 80).fill('#fef12a')
            .rect(0, 80, doc.page.width, 30).fill('#e32e26')
            .image(__dirname+ '/logo.png', 200, 0, {align: 'center', width: 150})
            .moveDown()
            .fillColor('white')
            .fontSize(9)
            .text("PORTA-CAMP CONSTRUCTION DIVISION", {width: 480, align: 'center'})
            .text("PORTA-CABINS OFFSHORE CONTAINERS and SPECIALIZED CONTAINER", {width: 480, align: 'center'})
            .fontSize(10)
            .moveDown()
            .moveDown()
            .fillColor('black')
            .text("Jakarta Office: Jl. Rorotan Babek TNI, No 2-3 Cakung Timur, Jakarta 13910 Indonesia.", {width: 480, align: 'center'})
            .text("Phone: +62-21-4605-021 * Fax: +62-21-4605-028, Email: enquiries@tradecorp.co.id, www.tradecorp.co.id", {width: 480, align: 'center'})
            .fontSize(18)
            .moveDown()
            .fillColor('red')
            .text("DELIVERY ORDER", {width: 480, align: 'center', underline: true})
            .fillColor('black')
            .fontSize(11)
            .moveDown()
            .moveDown()
            .text(`TO : ${jsonData.data.destination.name}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.address}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.city} ${jsonData.data.destination.postal_code}`, {width: 480, align: 'left'})
            .text(`       ${jsonData.data.destination.country}`, {width: 480, align: 'left'})
            .moveDown()
            .moveDown()
            .text(`Date                 :  ${dateFormat(jsonData.data.date)}`, {width: 480, align: 'left'})
            .moveDown()
            .text("Telpon              : 031-2233234", {width: 480, align: 'left'})
            .moveDown()
            .text("PIC                   : Pak Heru", {width: 480, align: 'left'})
            .moveDown()
            .text(`No. Referensi   :  ${dateFormat(jsonData.data.reference_number)}`, {width: 480, align: 'left'})
            .moveDown()
            .moveDown()
            .text(
                `Kami dari  ${jsonData.data.company.name} mengkonfirmasi kepada depo ${jsonData.data.destination.name} di Surabaya untuk dapat menerima kontainer milik  ${jsonData.data.company.name} daru customer kami atas nama  ${jsonData.data.customer.company} - 1x20' GP Dry Container Empty dengan nomor container sebagai berikut.`, 
                {width: 480, align: 'left'}
            )
            .moveDown()
            .moveDown()
            .text(
                "Demikian DO Acceptance ini kami buat, atas bantuan dan kerjasamanya kami ucapkan terima kasih.", 
                {width: 480, align: 'left'}
            )
            .moveDown()
            .moveDown()
            .moveDown()

            .text(`${jsonData.data.signature.name}`, 365, 630, { align: "left" })
            .text("Dika", 365, 678, { align: "left" })
            .text(`(${jsonData.data.company.name})`, 365, 692, { align: "left" })
        doc.pipe(res)
        doc.end()
        return
    } catch (error) {
        console.log(error)
    }
}

function createTable(doc, data, width = 500) {
    const   startY = doc.y,
            startX = doc.x,
            distanceY = 15,
            distanceX = 10;
  
    doc.fontSize(12);
  
    let currentY = startY;
  
    data.forEach(value => {
      let currentX = startX, size = value.length;
  
      let blockSize = width/size;
  
      value.forEach(text => {
        doc .text(text, currentX + distanceX, currentY);
        doc .lineJoin("miter")
            .rect(currentX, currentY, blockSize, distanceY)
            .stroke();
        currentX += blockSize;
      });
  
      currentY += distanceY;
    });
}

module.exports = {
    ping,
    exportDoAcceptance,
    exportDoRelease,
}
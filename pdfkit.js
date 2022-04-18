const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createpdfDoc(issuesArr,folderpath,repoName){
    
    let pdfDoc = new PDFDocument;
    const filePath = path.join(folderpath,`${repoName}.pdf`);
    pdfDoc.pipe(fs.createWriteStream(filePath));
    
    for(let i = 0; i<issuesArr.length; i++){

        let myArrayOfItems = [issuesArr[i].issueName];
        
        pdfDoc.list(myArrayOfItems);
        // Move down a bit to provide space between lists
        pdfDoc.moveDown(0.5);
        
        let innerList = [issuesArr[i].issueLink];
        let nestedArrayOfItems = ['LINK TO ISSUE :- ', innerList];
        
        pdfDoc.list(nestedArrayOfItems);
    }
    
    pdfDoc.end();
}

module.exports = createpdfDoc;
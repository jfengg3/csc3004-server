const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 3001; 
const cors = require('cors');
const storage = multer.diskStorage({

    // [Unique generated file name]
    /*
    destination: 'uploads/', // Specify the destination folder
    filename: (req, file, cb) => {
      // Generate a unique filename for the uploaded file
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const originalFileExtension = file.originalname.split('.').pop();
      const filename = `${file.fieldname}-${uniqueSuffix}.${originalFileExtension}`;
      cb(null, filename);
    },
    */

    // [Original file name]
    
    destination: 'uploads/', // Specify the destination folder
    filename: (req, file, cb) => {
        // Use the original filename of the uploaded file
        cb(null, file.originalname);
    },
    
  });
  
const upload = multer({ storage: storage });

// Enable CORS
app.use(cors());

// File upload endpoint
app.post('/upload', upload.single('resume'), async (req, res) => {
    
    // Access the uploaded file using req.file
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
      
    }
    // Process the uploaded file as needed (e.g., store it in a database, perform analysis, etc.)
    // Return a response indicating the success status or any relevant information

    // Determine file extension
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    try {
        let resumeData;

        if (fileExtension === 'pdf' || 'docx') {

          // Resume parser
          const ResumeParser = require('resume-parser');

          // cons
          ResumeParser.parseResumeFile(req.file.path, 'uploads/') // input file, output dir
          .then(file => {
              console.log(file + " > extracted to json success > ");
          })
          .catch(error => {
              console.error(error);
          });

        } else {

          // Unsupported file type
          return res.status(400).send('Invalid file type. Only PDF and DOCX files are allowed.');

        }

      } catch (error) {
        console.log('Error occurred during resume parsing:', error);
        return res.status(500).send('Internal server error');
      }
      
    // THIS WILL BE SEND AND RENDER ON THE CLIENT SIDE
    const responseData = {
        results: [
          {
            id: 1,
            title: 'Software Engineer',
            company: 'ABC Inc.',
            description: 'Lorem ipsum dolor sit amet.',
            joblink: 'https://sg.linkedin.com/jobs/view/full-stack-developer-at-capgemini-3615331602?refId=8YO9aiK%2BimUDH%2FPStwJj1Q%3D%3D&trackingId=SQ8UmzgL1M0%2FvEk18QxIxg%3D%3D&position=14&pageNum=0&trk=public_jobs_jserp-result_search-card',
            compatibility: 80,
          },
          {
            id: 2,
            title: 'Frontend Developer',
            company: 'XYZ Corp.',
            description: 'Lorem ipsum dolor sit amet.',
            joblink: 'https://sg.linkedin.com/jobs/view/full-stack-developer-at-capgemini-3615331602?refId=8YO9aiK%2BimUDH%2FPStwJj1Q%3D%3D&trackingId=SQ8UmzgL1M0%2FvEk18QxIxg%3D%3D&position=14&pageNum=0&trk=public_jobs_jserp-result_search-card',
            compatibility: 90,
          },
          
        ],
      };
      
    res.json(responseData); // Sending the response back to client-side
    
  });

  // Run the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

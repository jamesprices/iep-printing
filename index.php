<?php

require('vendor/autoload.php');

use mikehaertl\pdftk\Pdf;

$pdf = new Pdf('demo.pdf');

$data = $pdf->getDataFields();

var_dump($data);

// $pdf->fillForm(array('name'=>'ÄÜÖ äüö мирано čárka'))
//     ->needAppearances()
//     ->saveAs('filled.pdf');

// // Fill form from FDF
// $pdf = new Pdf('form.pdf');
// $pdf->fillForm('data.fdf')
//     ->saveAs('filled.pdf');

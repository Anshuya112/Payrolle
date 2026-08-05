<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use App\Models\EmployeeDocument;

class EmployeeDocumentController extends Controller
{
    public function show($id)
    {
        $documents = EmployeeDocument::where(
            "employee_id",
            $id
        )->first();

        if (!$documents) {
            return response()->json([
                "message" => "No documents found"
            ], 404);
        }

        return response()->json([
            "documents" => [

                [
                    "name" => "Aadhar Card",
                    "file" => $documents->aadhar_card,
                    "url"  => asset("storage/" . $documents->aadhar_card)
                ],

                [
                    "name" => "Resume",
                    "file" => $documents->resume,
                    "url"  => asset("storage/" . $documents->resume)
                ],

                [
                    "name" => "PAN Card",
                    "file" => $documents->pan_card,
                    "url"  => $documents->pan_card
                        ? asset("storage/" . $documents->pan_card)
                        : null
                ],

                [
                    "name" => "Reports",
                    "file" => $documents->reports,
                    "url"  => $documents->reports
                        ? asset("storage/" . $documents->reports)
                        : null
                ],

                [
                    "name" => "Experience Letter",
                    "file" => $documents->experience_letter,
                    "url"  => $documents->experience_letter
                        ? asset("storage/" . $documents->experience_letter)
                        : null
                ],

                [
                    "name" => "Other Document",
                    "file" => $documents->other_document,
                    "url"  => $documents->other_document
                        ? asset("storage/" . $documents->other_document)
                        : null
                ]

            ]
        ]);
    }
}
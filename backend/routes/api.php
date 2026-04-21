<?php
use App\Http\Controllers\Recruiter\OfferController;
use App\Http\Controllers\Candidate\ApplicationController;
use App\Http\Controllers\Candidate\CvController;
use App\Http\Controllers\Candidate\CandidatureController;
use App\Http\Controllers\Admin\OfferModerationController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SpecialtyController;
use App\Http\Controllers\Admin\EnterpriseAdminController;
use App\Http\Controllers\Admin\OfferAdminController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\Auth\RegisteredCandidateController;
use App\Http\Controllers\Auth\RegisteredRecruiterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EnterpriseController;
use Illuminate\Support\Facades\Route;

// Public Enterprise Listing
Route::get('/enterprises', [EnterpriseController::class, 'index']);
Route::get('/enterprises/{id}', [EnterpriseController::class, 'show']);

// Public Job Listing
Route::get('/jobs', [\App\Http\Controllers\PublicOfferController::class, 'index']);
Route::get('/jobs/{id}', [\App\Http\Controllers\PublicOfferController::class, 'show']);

// Admin Auth
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// User Auth (Candidates & Recruiters)
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register/candidate', [RegisteredCandidateController::class, 'store']);
Route::post('/register/recruiter', [RegisteredRecruiterController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Supporting Data (Publicly accessible for filters)
Route::get('/supporting-data/categories', [\App\Http\Controllers\SupportingDataController::class, 'categories']);
Route::get('/supporting-data/specialties', [\App\Http\Controllers\SupportingDataController::class, 'specialties']);
Route::get('/supporting-data/languages', [\App\Http\Controllers\SupportingDataController::class, 'languages']);
Route::get('/supporting-data/skills', [\App\Http\Controllers\SupportingDataController::class, 'skills']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

    Route::middleware('recruiter')->prefix('recruiter')->group(function () {
        Route::get('/offers', [OfferController::class, 'index']);
        Route::get('/offers/{offer}', [OfferController::class, 'show']);
        Route::post('/offers', [OfferController::class, 'store']);
        Route::put('/offers/{offer}', [OfferController::class, 'update']);
        Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);
        Route::get('/applications/{candidature}/candidate-profile', [OfferController::class, 'getCandidateProfile']);
        Route::put('/applications/{candidature}/status', [OfferController::class, 'updateApplicationStatus']);
        Route::put('/applications/{candidature}/note', [OfferController::class, 'updateApplicationNote']);
        
        // Profile & Enterprise routes
        Route::get('/profile', [\App\Http\Controllers\Recruiter\RecruiterProfileController::class, 'show']);
        Route::put('/profile', [\App\Http\Controllers\Recruiter\RecruiterProfileController::class, 'updateProfile']);
        Route::put('/enterprise', [\App\Http\Controllers\Recruiter\RecruiterProfileController::class, 'updateEnterprise']);
        Route::post('/enterprise/logo', [\App\Http\Controllers\Recruiter\RecruiterProfileController::class, 'uploadLogo']);

        // Sourcing (Candidate Search)
        Route::get('/search-candidates', [\App\Http\Controllers\Recruiter\CandidateSearchController::class, 'index']);
        Route::post('/contact-requests', [\App\Http\Controllers\Recruiter\CandidateSearchController::class, 'sendRequest']);
        Route::get('/candidates/{candidate}/profile', [\App\Http\Controllers\Recruiter\CandidateSearchController::class, 'showCandidateProfile']);
    });

    Route::middleware('candidate')->prefix('candidate')->group(function () {
        Route::post('/apply/{offer}', [ApplicationController::class, 'store']);
        
        // Profile routes
        Route::get('/profile', [\App\Http\Controllers\Candidate\CandidateProfileController::class, 'show']);
        Route::put('/profile', [\App\Http\Controllers\Candidate\CandidateProfileController::class, 'update']);
        Route::post('/profile/photo', [\App\Http\Controllers\Candidate\CandidateProfileController::class, 'uploadPhoto']);

        // CV routes
        Route::get('/cv', [CvController::class, 'show']);
        Route::put('/cv', [CvController::class, 'update']);
        Route::post('/cv/pdf', [CvController::class, 'uploadPdf']);
        Route::delete('/cv/pdf', [CvController::class, 'deletePdf']);
        
        // Candidatures routes
        Route::get('/candidatures', [CandidatureController::class, 'index']);
        Route::post('/candidatures', [CandidatureController::class, 'store']);
        Route::delete('/candidatures/{id}', [CandidatureController::class, 'destroy']);
        // Favoris routes
        Route::get('/favorites', [\App\Http\Controllers\Candidate\FavoriController::class, 'index']);
        Route::post('/favorites/{id}/toggle', [\App\Http\Controllers\Candidate\FavoriController::class, 'toggle']);

        // Received Contact Requests
        Route::get('/contact-requests', [\App\Http\Controllers\Candidate\ContactRequestController::class, 'index']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'stats']);
        Route::post('/offers/{offer}/approve', [OfferModerationController::class, 'approve']);
        Route::post('/offers/{offer}/status', [OfferModerationController::class, 'updateStatus']);
        
        // Admin categories & specialties CRUD
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('specialties', SpecialtyController::class);

        // Admin enterprises & offers & users
        Route::get('/enterprises', [EnterpriseAdminController::class, 'index']);
        Route::delete('/enterprises/{enterprise}', [EnterpriseAdminController::class, 'destroy']);

        Route::get('/offers', [OfferAdminController::class, 'index']);
        Route::delete('/offers/{offer}', [OfferAdminController::class, 'destroy']);

        Route::get('/candidates', [UserAdminController::class, 'index']);
        Route::delete('/candidates/{user}', [UserAdminController::class, 'destroy']);
    });

});
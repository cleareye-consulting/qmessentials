<?php

namespace App\Http\Controllers;

use App\Metric;
use App\MetricAvailableQualfier;
use App\MetricAvailableUnit;
use App\MetricIndustryStandard;
use App\MetricMethodologyReference;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class MetricController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $metrics = Metric::all();
        return view('metrics/metrics', ['metrics' => $metrics]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {        
        if (Gate::denies('write-metric')) {
            return redirect()->action('MetricController@index');
        }
        return view('metrics/create-metric');
    }

    private function parseAvailableUnits($input) {
        return preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeAvailableUnits($metric, $availableUnits) {
        $sortOrder = 1;
        foreach ($availableUnits as $availableUnit) {
            $metricAvailableUnit = new MetricAvailableUnit;
            $metricAvailableUnit->metric_id = $metric_id;
            $metricAvailableUnit->unit = $availableUnit;
            $metricAvailableUnit->sort_order = $sortOrder++;
            $metricAvailableUnit->save();                
        }
    }

    private function parseAvailableQualfiers($input) {
        return preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeAvailableQualifiers($metric, $availableQualifiers) {
        $sortOrder = 1;
        foreach ($availableQualifiers as $availableQualifier) {
            $metricAvailableQualifier = new MetricAvailableQualifier;
            $metricAvailableQualifier->metric_id = $metric_id;
            $metricAvailableQualifier->qualifier = $availableQualifier;
            $metricAvailableQualifier->sort_order = $sortOrder++;
            $metricAvailableQualifier->save();
        }
    }

    private function parseIndustryStandards($input) {
        return preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeIndustryStandards($metric, $industryStandards) {
        $sortOrder = 1;
        foreach ($industryStandards as $industryStandard) {
            $metricIndustryStandard = new MetricIndustryStandard;
            $metricIndustryStandard->metric_id = $metric_id;
            $metricIndustryStandard->industry_standard = rtrim($industryStandard);
            $metricIndustryStandard->sort_order = $sortOrder++;
            $metricIndustryStandard->save();
        }
    }

    private function parseMethodologyReferences($input) {
        return preg_split('/[\n]+/', $request->input('methodology_references'), -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeMethodologyReferences($metric, $methodologyReferences) {
        $sortOrder = 1;
        foreach ($methodologyReferences as $methodologyReference) {
            $metricMethodologyReference = new MetricMethodologyReference;
            $metricMethodologyReference->metric_id = $metric_id;
            $metricMethodologyReference->methodology_reference = $methodologyReference;
            $metricMethodologyReference->sort_order = $sortOrder++;
            $metricMethodologyReference->save();
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {    
        if (Gate::denies('write-metric')) {
            return redirect()->action('MetricController@index');
        }   
        $has_multiple_results = $request->has_multiple_results == 'on';
        DB::transaction(function() use ($request) {
            $metric = new Metric;
            $metric->metric_name = $request->metric_name;
            $metric->has_multiple_results = $has_multiple_results;
            $metric->save();
            $this->storeAvailableUnits($metric, $this->parseAvailableUnits($request->available_units));
            $this->storeAvailableQualifiers($metric, $this->parseAvailableQualfiers($request->available_qualifiers));
            $this->storeIndustryStandards($metric, $this->parseIndustryStandards($request->industry_standards));
            $this->storeMethodologyReferences($metric, $this->parseMethodologyReferences($request->methodology_references));
        });
        return redirect()->action('MetricController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (Gate::denies('read-metric')) {
            return redirect()->action('MetricController@index');
        }    
        $metric = Metric::find($id);
        $availableQualifiers = MetricAvailableQualifier::where('metric_id', $id)->orderBy('sort_order')->pluck('qualifier');
        $availableUnits = MetricAvailableUnit::where('metric_id', $id)->orderBy('sort_order')->pluck('unit');
        $industryStandards = MetricIndustryStandard::where('metric_id', $id)->orderBy('sort_order')->pluck('industry_standard');
        $methodologyReferences = MetricMethodologyReference::where('metric_id', $id)->orderBy('sort_order')->pluck('methodology_reference');
        $model = [
            'metric_id' => $metric->metric_id,
            'metric_name' => $metric->metric_name,
            'has_multiple_results' => $metric->has_multiple_results,
            'available_qualifiers' => $availableQualifiers,
            'available_units' => $availableUnits,
            'industry_standards' => $industryStandards,
            'methodology_references' => $methodologyReferences
        ];
        return view('metrics/view-metric', ['metric' => (object)$model]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Gate::denies('write-metric')) {
            return redirect()->action('MetricController@index');
        }    
        $metric = Metric::find($id);
        $availableQualifiers = MetricAvailableQualifier::where('metric_id', $id)->orderBy('sort_order')->pluck('qualifier');
        $availableUnits = MetricAvailableUnit::where('metric_id', $id)->orderBy('sort_order')->pluck('unit');
        $industryStandards = MetricIndustryStandard::where('metric_id', $id)->orderBy('sort_order')->pluck('industry_standard');
        $methodologyReferences = MetricMethodologyReference::where('metric_id', $id)->orderBy('sort_order')->pluck('methodology_reference');
        $model = [
            'metric_id' => $metric->metric_id,
            'metric_name' => $metric->metric_name,
            'has_multiple_results' => $metric->has_multiple_results,
            'available_qualifiers' => $availableQualifiers,
            'available_units' => $availableUnits,
            'industry_standards' => $industryStandards,
            'methodology_references' => $methodologyReferences
        ];
        return view('metrics/edit-metric', ['metric' => (object)$model]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Gate::denies('write-metric')) {
            return redirect()->action('MetricController@index');
        }    
        DB::transaction(function() use ($request, $id) {
            $has_multiple_results = $request->has_multiple_results == 'on';
            $metric = Metric::find($id);
            $metric->has_multiple_results = $has_multiple_results;
            $metric->save();
            MetricAvailableUnit::where('metric_id', $id)->delete();
            MetricAvailableQualifier::where('metric_id', $id)->delete();
            MetricIndustryStandard::where('metric_id', $id)->delete();
            MetricMethodologyReference::where('metric_id', $id)->delete();
            $this->storeAvailableUnits($metric, $this->parseAvailableUnits($request->available_units));
            $this->storeAvailableQualifiers($metric, $this->parseAvailableQualfiers($request->available_qualifiers));
            $this->storeIndustryStandards($metric, $this->parseIndustryStandards($request->industry_standards));
            $this->storeMethodologyReferences($metric, $this->parseMethodologyReferences($request->methodology_references));
        });
        return redirect()->action('MetricController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Metric::destroy($id);
    }
}

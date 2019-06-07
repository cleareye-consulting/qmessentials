<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        $metrics = \App\Metric::all();
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
        return preg_split('/[,\s]+/', $input, -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeAvailableUnits($metric, $availableUnits) {
        $sortOrder = 1;
        foreach ($availableUnits as $availableUnit) {                        
            $metricAvailableUnit = new \App\MetricAvailableUnit;
            $metricAvailableUnit->metric_id = $metric->id;
            $metricAvailableUnit->unit = $availableUnit;
            $metricAvailableUnit->sort_order = $sortOrder++;
            $metricAvailableUnit->save();                
        }
    }

    private function parseAvailableQualfiers($input) {
        return preg_split('/[,\s]+/', $input, -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeAvailableQualifiers($metric, $availableQualifiers) {
        $sortOrder = 1;
        foreach ($availableQualifiers as $availableQualifier) {
            $metricAvailableQualifier = new \App\MetricAvailableQualifier;            
            $metricAvailableQualifier->metric_id = $metric->id;
            $metricAvailableQualifier->qualifier = $availableQualifier;
            $metricAvailableQualifier->sort_order = $sortOrder++;
            $metricAvailableQualifier->save();
        }
    }

    private function parseIndustryStandards($input) {
        return preg_split('/[\n]+/', $input, -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeIndustryStandards($metric, $industryStandards) {
        $sortOrder = 1;
        foreach ($industryStandards as $industryStandard) {
            $metricIndustryStandard = new \App\MetricIndustryStandard;
            $metricIndustryStandard->metric_id = $metric->id;
            $metricIndustryStandard->industry_standard = rtrim($industryStandard);
            $metricIndustryStandard->sort_order = $sortOrder++;
            $metricIndustryStandard->save();
        }
    }

    private function parseMethodologyReferences($input) {
        return preg_split('/[\n]+/', $input, -1, PREG_SPLIT_NO_EMPTY);
    }

    private function storeMethodologyReferences($metric, $methodologyReferences) {
        $sortOrder = 1;
        foreach ($methodologyReferences as $methodologyReference) {
            $metricMethodologyReference = new \App\MetricMethodologyReference;
            $metricMethodologyReference->metric_id = $metric->id;
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
        DB::transaction(function() use ($request) {
            $has_multiple_results = $request->has_multiple_results == 'on';
            $metric = new \App\Metric;
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
        $metric = \App\Metric::find($id);
        $availableQualifiers = \App\MetricAvailableQualifier::where('metric_id', $id)->orderBy('sort_order')->pluck('qualifier');
        $availableUnits = \App\MetricAvailableUnit::where('metric_id', $id)->orderBy('sort_order')->pluck('unit');
        $industryStandards = \App\MetricIndustryStandard::where('metric_id', $id)->orderBy('sort_order')->pluck('industry_standard');
        $methodologyReferences = \App\MetricMethodologyReference::where('metric_id', $id)->orderBy('sort_order')->pluck('methodology_reference');
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
        $metric = \App\Metric::find($id);
        $availableQualifiers = \App\MetricAvailableQualifier::where('metric_id', $id)->orderBy('sort_order')->pluck('qualifier')->toArray();
        $availableUnits = \App\MetricAvailableUnit::where('metric_id', $id)->orderBy('sort_order')->pluck('unit')->toArray();
        $industryStandards = \App\MetricIndustryStandard::where('metric_id', $id)->orderBy('sort_order')->pluck('industry_standard')->toArray();
        $methodologyReferences = \App\MetricMethodologyReference::where('metric_id', $id)->orderBy('sort_order')->pluck('methodology_reference')->toArray();
        $model = [
            'metric_id' => $metric->id,
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
            $metric = \App\Metric::find($id);
            $metric->has_multiple_results = $has_multiple_results;
            $metric->save();
            \App\MetricAvailableUnit::where('metric_id', $id)->delete();
            \App\MetricAvailableQualifier::where('metric_id', $id)->delete();
            \App\MetricIndustryStandard::where('metric_id', $id)->delete();
            \App\MetricMethodologyReference::where('metric_id', $id)->delete();
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
        \App\Metric::destroy($id);
    }

    public function getAvailableQualifiers($metric_id) {
        $availableQualifiers = \App\MetricAvailableQualifier::where('metric_id', $metric_id)->orderBy('sort_order')->pluck('qualifier');
        return response()->json($availableQualifiers);
    }

    public function getAvailableUnits($metric_id) {
        $availableUnits = \App\MetricAvailableUnit::where('metric_id', $metric_id)->orderBy('sort_order')->pluck('unit');
        return response()->json($availableUnits);
    }
}

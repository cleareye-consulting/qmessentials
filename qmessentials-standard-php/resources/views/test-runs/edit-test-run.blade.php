@extends('layouts/app')

@section('title','Edit Test Run')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit Test Run</h2>  
    <h3>Lot {{$test_run->item->lot->lot_number}} &ndash; Item {{$test_run->item->item_number}} &ndash; {{$test_run->testPlan->test_plan_name}}</h3>
    <form class="form" action="/test-runs/{{$test_run->id}}" method="POST">
        {{csrf_field()}}        
        <input type="hidden" id="id" name="id" value="{{$test_run->id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <table class="table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Range</th>
                    <th>Values</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($test_run->observations()->get() as $observation)
                <tr>
                    <td><a href="/metrics/{{$observation->testPlanMetric->metric_id}}" target="_blank">{{$observation->testPlanMetric->metric->metric_name}}{{$observation->testPlanMetric->qualifier == '' ? '' : ' (' . $observation->testPlanMetric->qualifier . ')'}}{{!($observation->testPlanMetric->is_nullable) ? '*' : ''}}</a></td>
                    <td class="observation-criteria">{{\App\TestPlanMetric::reconstructCriteria($observation->min_value, $observation->is_min_value_inclusive, $observation->max_value, $observation->is_max_value_inclusive)}} {{$observation->testPlanMetric->unit}}</td>
                    <td 
                        data-min-value="{{$observation->min_value}}" 
                        data-is-min-value-inclusive="{{$observation->is_min_value_inclusive ? 'true' : 'false'}}"
                        data-max-value="{{$observation->max_value}}"
                        data-is-max-value-inclusive="{{$observation->is_max_value_inclusive ? 'true' : 'false'}}">
                    @if ($observation->testPlanMetric->metric->has_multiple_results)
                        <textarea class="form-control observation-results" name="observation-results-{{$observation->id}}">{{implode(' ', $observation->observationResults()->get()->map(function($orv) {return $orv->result_value;})->toArray())}}</textarea>
                    @else
                        <input class="form-control observation-results" name="observation-results-{{$observation->id}}" value="{{$observation->observationResults()->first()->result_value}}"/>
                    @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <div class="form-group">
            <button class="btn btn-primary">Update Test Run</button>
            <a class="btn btn-outline-secondary" href="/test-runs">Cancel</a>
        </div>
    </form>
    </div>
@endsection

@section ('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => {        

            colorizeResult = target => {
                const values = target.type === 'text' ? [ target.val() ] : target.val().split(' ').filter(val => val !== '');
                const parent = target.parents('td');
                if (values.length === 0) {
                    parent.parents('tr').css('color','black');
                    target.css('color','black').css('font-weight','normal');
                    return;
                }                
                const minValue = parent.data('minValue') || Number.MIN_SAFE_INTEGER;
                const isMinValueInclusive = parent.data('isMinValueInclusive');
                const maxValue = parent.data('maxValue') || Number.MAX_SAFE_INTEGER;
                const isMaxValueInclusive = parent.data('isMaxValueInclusive');
                const anyFailing = values.filter(value => {
                    if (isMinValueInclusive === true) {
                        if (+value < minValue) {
                            return true;
                        }
                    }
                    else {
                        if (+value <= minValue) {
                            return true;
                        }
                    }
                    if (isMaxValueInclusive === true) {
                        if (+value > maxValue) {
                            return true;
                        }
                    }
                    else {
                        if (+value >= maxValue) {
                            return true;
                        }
                    }                    
                    return false;                    
                }).length > 0;
                if (anyFailing) {
                    parent.parents('tr').css('color','red');
                    target.css('color','red').css('font-weight','bold');
                }
                else {
                    parent.parents('tr').css('color','green');
                    target.css('color','green').css('font-weight','normal');
                }
            };

            $('.observation-results').change(event => {
                colorizeResult($(event.target));
            });
            
            for(input of $('.observation-results')) {                
                colorizeResult($(input));    
            }           

        });
    </script>
@endsection

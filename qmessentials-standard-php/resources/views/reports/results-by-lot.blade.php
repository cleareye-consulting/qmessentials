@extends('layouts/app')

@section('title','Results by Lot')

@section('content')
    <div class="container">
        <h2 class="subtitle">Results by Lot</h2>  
        @can('read-aggregate-data')
        <form>
            <div class="form-group">
                <select class="form-control" name="lot_id" id="lot_id">
                    <option value="0">Select a Lot...</option>
                    @foreach ($lots as $lot)
                    <option value="{{$lot->id}}" {{($lot->id == $lot_id ? 'selected' : '')}}>{{$lot->lot_number}}</option>
                    @endforeach
                </select>
            </div>
        </form>
        @if(!is_null($lot_id))
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Criteria</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Range</th>
                    <th>Count</th>
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($results->records as $record)
                <tr>
                    <td>{{$record->metric}}</td>
                    <td>{{$record->criteria}} {{$record->unit}}</td>
                    <td>{{$record->min}}</td>
                    <td>{{$record->max}}</td>
                    <td>{{$record->range}}</td>
                    <td>{{$record->count}}</td>
                    <td>{{$record->average}}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
        @endcan
        @cannot('read-aggregate-data')
        <p class="lead">You must be in role 'Quality Manager' to view reports.</p>
        @endcannot
    </div>
    
@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => {
            $('#lot_id').change(() => {
                window.location.assign('/reports/results-by-lot/' + $('#lot_id').val());
            });
        });
    </script>
@endsection